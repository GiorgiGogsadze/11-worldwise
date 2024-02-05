import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";

const API_URL = "http://localhost:8000";

const CitiesContext = createContext();

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities context isn't defined here");
  return context;
}

const initialCityState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

const cityReducer = (state, action) => {
  switch (action.type) {
    case "startLoading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, cities: action.payLoad, isLoading: false };
    case "city/loaded":
      return { ...state, currentCity: action.payLoad, isLoading: false };
    case "city/uploaded":
      return {
        ...state,
        cities: [...state.cities, action.payLoad],
        isLoading: false,
        currentCity: action.payLoad,
      };
    case "city/removed":
      return {
        ...state,
        cities: state.cities.filter((el) => el.id !== action.payLoad),
        isLoading: false,
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payLoad };
    default:
      throw new Error(
        `${action.type} is undefined action type in city reducer`
      );
  }
};

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, disCity] = useReducer(
    cityReducer,
    initialCityState
  );

  const countries = cities.reduce(
    (acc, cur) =>
      acc.some((el) => el.country === cur.country)
        ? acc
        : [...acc, { country: cur.country, emoji: cur.emoji }],
    []
  );

  useEffect(() => {
    (async () => {
      try {
        disCity({ type: "startLoading" });
        const res = await fetch(`${API_URL}/cities`);
        const data = await res.json();
        disCity({ type: "cities/loaded", payLoad: data });
      } catch (err) {
        disCity({
          type: "rejected",
          payLoad: "There was an error loading data...",
        });
      }
    })();
  }, []);

  const getCurrentCity = useCallback(
    async (id) => {
      if (id == currentCity.id) return;
      try {
        disCity({ type: "startLoading" });
        const res = await fetch(`${API_URL}/cities/${id}`);
        const data = await res.json();
        disCity({ type: "city/loaded", payLoad: data });
      } catch (err) {
        disCity({
          type: "rejected",
          payLoad: "There was an error loading city data",
        });
      }
    },
    [currentCity.id]
  );

  const uploadCity = async (cityObj) => {
    try {
      disCity({ type: "startLoading" });
      const res = await fetch(`${API_URL}/cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cityObj),
      });
      const data = await res.json();
      disCity({ type: "city/uploaded", payLoad: data });
    } catch (err) {
      disCity({ type: "rejected", payLoad: "couldn't upload city" });
    }
  };

  const removeCity = async (id) => {
    try {
      disCity({ type: "startLoading" });
      await fetch(`${API_URL}/cities/${id}`, {
        method: "DELETE",
      });
      disCity({ type: "city/removed", payLoad: id });
    } catch (err) {
      disCity({ type: "rejected", payLoad: "couldn't delete city" });
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        countries,
        currentCity,
        isLoading,
        error,
        getCurrentCity,
        uploadCity,
        removeCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { useCities, CitiesProvider };
