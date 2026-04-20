import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import db from "../firebase";
import { User } from "firebase/auth";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";


export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
    user: null as import("firebase/auth").User | null,
    unsubscribe: null as (() => void) | null, 
  }),

  actions: {
    init() {
      return Promise.all([

        // fetch all options
        getDocs(collection(db, "bases")),
        getDocs(collection(db, "creamers")),
        getDocs(collection(db, "syrups")),
      ]).then(([basesSnap, creamersSnap, syrupsSnap]) => {
        
        // map Firestore documents to our types
        this.bases = basesSnap.docs.map(doc => doc.data() as BaseBeverageType);
        this.creamers = creamersSnap.docs.map(doc => doc.data() as CreamerType);
        this.syrups = syrupsSnap.docs.map(doc => doc.data() as SyrupType);

        // set defaults
        this.currentBase = this.bases.find(b => b.name === "Green Tea") ?? this.bases[0];
        this.currentCreamer = this.creamers.find(c => c.name === "No Cream") ?? this.creamers[0];
        this.currentSyrup = this.syrups.find(s => s.name === "No Syrup") ?? this.syrups[0];
      });
    },

    setUser(user: User | null) {
      this.user = user;

      // detach previous listener if one exists
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }

      if (user) {
        // start a new listener for only this user's beverages
        const q = query(
          collection(db, "beverages"),
          where("user_id", "==", user.uid)
        );

        this.unsubscribe = onSnapshot(q, (snapshot) => {
          this.beverages = snapshot.docs.map(firestoreDoc => {
            const data = firestoreDoc.data();

            // look up full objects from store using the saved IDs
            const base = this.bases.find(b => b.id === data.collection_id.base) ?? this.bases[0];
            const creamer = this.creamers.find(c => c.id === data.collection_id.creamer) ?? this.creamers[0];
            const syrup = this.syrups.find(s => s.id === data.collection_id.syrup) ?? this.syrups[0];

            return {
              id: data.beverage_id,
              name: data.name,
              temp: data.temp,
              base,
              creamer,
              syrup,
            } as BeverageType;
          });

          // set currentBeverage to the first one, or null if none
          if (this.beverages.length > 0) {
            this.currentBeverage = this.beverages[0];
          } else {
            this.currentBeverage = null;
          }
        });
      } else {
        // user logged out, clear beverages
        this.beverages = [];
        this.currentBeverage = null;
      }
    },

    makeBeverage() {
      // check if user is signed in
      if (!this.user) {
        return "No user logged in, please sign in first.";
      }

      // check if all fields are filled in
      if (!this.currentBase || !this.currentCreamer || !this.currentSyrup || !this.currentTemp || !this.currentName) {
        return "Please complete all beverage options and the name before making a beverage.";
      }

      // build unique beverage id
      const beverageId = `${this.user.uid}_${Date.now()}`;

      // build the beverage object
      const newBeverage: BeverageType = {
        id: beverageId,
        name: this.currentName,
        temp: this.currentTemp,
        base: this.currentBase,
        syrup: this.currentSyrup,
        creamer: this.currentCreamer,
      };

      // save to Firestore
      setDoc(doc(db, "beverages", beverageId), {
        beverage_id: beverageId,
        name: this.currentName,
        user_id: this.user.uid,
        temp: this.currentTemp,
        collection_id: {
          base: this.currentBase.id,
          syrup: this.currentSyrup.id,
          creamer: this.currentCreamer.id,
        },
      });

      this.beverages.push(newBeverage);
      this.currentBeverage = newBeverage;
      this.currentName = "";

      return `Beverage ${newBeverage.name} made successfully!`;
    },

    showBeverage(beverage: BeverageType) {
      this.currentBeverage = beverage;
      this.currentBase = beverage.base;
      this.currentCreamer = beverage.creamer;
      this.currentSyrup = beverage.syrup;
      this.currentTemp = beverage.temp;
    },
  },
});
