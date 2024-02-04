// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import Message from "./Message";
import ButtonBack from "./ButtonBack";
import Spinner from "./Spinner";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const { uploadCity, isLoading: isLoadingUpdate } = useCities();
  const [lat, lng] = useUrlPosition();

  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [geoError, setGeoError] = useState("");
  const navigate = useNavigate();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    if (!lat || !lng) return;
    (async () => {
      try {
        setIsLoadingGeo(true);
        setGeoError("");
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryName)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else"
          );
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeoError(err.message);
      } finally {
        setIsLoadingGeo(false);
      }
    })();
  }, [lat, lng]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityName || !date) return;
    const cityObj = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await uploadCity(cityObj);
    navigate("/app/cities");
  };

  if (isLoadingGeo) return <Spinner />;
  if (geoError) return <Message message={geoError} />;
  if (!lat || !lng) return <Message message="strat by clicking on the map" />;
  return (
    <form
      className={`${styles.form} ${isLoadingUpdate ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
          id="date"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
