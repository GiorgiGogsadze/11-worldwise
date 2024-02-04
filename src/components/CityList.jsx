import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";

import { useCities } from "../contexts/CitiesContext";

export default function CityList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (cities.length === 0)
    return (
      <Message
        message={"Add your first city by clicking on a city on the map"}
      />
    );
  return (
    <ul className={`${styles.cityList} noScroll`}>
      {cities.map((el) => (
        <CityItem city={el} key={el.id} />
      ))}
    </ul>
  );
}
