import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";
export default function CountryList() {
  const { countries, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (countries.length === 0)
    return (
      <Message
        message={"Add your first city by clicking on a city on the map"}
      />
    );
  return (
    <ul className={`${styles.countryList} noScroll`}>
      {countries.map((el) => (
        <CountryItem country={el} key={el.country} />
      ))}
    </ul>
  );
}
