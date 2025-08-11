import { City, State } from "country-state-city";
import { useEffect, useState } from "react";
import Selector from "./selector";

const App = () => {
  const indiaISOCode = "IN";
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [state, setState] = useState();
  const [city, setCity] = useState();

  useEffect(() => {
    setStateData(State.getStatesOfCountry(indiaISOCode));
  }, []);

  useEffect(() => {
    if (state) {
      setCityData(City.getCitiesOfState(indiaISOCode, state.isoCode));
    }
  }, [state]);

  useEffect(() => {
    if (stateData.length > 0) {
      setState(stateData[0]);
    }
  }, [stateData]);

  useEffect(() => {
    if (cityData.length > 0) {
      setCity(cityData[0]);
    }
  }, [cityData]);

  return (
    <section className="min-h-screen px-3 grid place-items-center pb-20 selection:text-white  bg-gradient-to-r  ">
      <div className="border border-gray-300 rounded-lg p-8 bg-blue-500">
        <h2 className="text-2xl font-bold ">State and City</h2>
        <br />
        <div className="flex flex-wrap gap-3">
          {state && (
            <div>
              <p className="font-semibold">State :</p>
              <Selector
                data={stateData}
                selected={state}
                setSelected={setState}
              />
            </div>
          )}
          {city && (
            <div>
              <p className="font-semibold">City :</p>
              <Selector data={cityData} selected={city} setSelected={setCity} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default App;