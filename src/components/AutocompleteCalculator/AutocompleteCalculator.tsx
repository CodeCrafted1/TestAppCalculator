import CreatableSelect from "react-select/creatable";
import create from "zustand";

import styles from "./AutocompleteCalculator.module.css";

const initialFormulas = [
  { value: "sum", label: "SUM" },
  { value: "avg", label: "AVERAGE" },
  { value: "min", label: "MINIMUM" },
  { value: "max", label: "MAXIMUM" },
];

const useStore = create((set) => ({
  value: [],
  userValues: [],
  result: null,
  setValue: (newValue: { value: string }) => set({ value: newValue }),
  setUserValues: (newUserValues: { userValues: string }) =>
    set({ userValues: newUserValues }),
  setResult: (newResult: { result: string }) => set({ result: newResult }),
}));

const AutocompleteCalculator = () => {
  //@ts-ignore
  const { value, setValue, userValues, setUserValues, result, setResult } =
    useStore();

  const allSuggestions = initialFormulas.concat(
    userValues.map(({ name }: { name: string }) => ({
      value: name,
      label: name,
    }))
  );

  const onChange = (selectedOptions: any) => {
    setValue(selectedOptions);
  };

  const addUserValue = (name: string, val: string) => {
    setUserValues([...userValues, { name, value: parseFloat(val) }]);
  };

  const calculateResult = () => {
    const [formula, ...inputs] = value
      .map((option: any) => option.value)
      .join(" ")
      .split(" ");
    const numbers = inputs.map((input: any) => {
      const userValue = userValues.find(
        ({ name }: { name: string }) => name === input
      );
      return userValue ? userValue.value : parseFloat(input);
    });

    let result;

    switch (formula.toLowerCase()) {
      case "sum":
        //@ts-ignore
        result = numbers.reduce((acc, num) => acc + num, 0);
        setResult(result);
        break;
      case "average":
        //@ts-ignore
        result = numbers.reduce((acc, num) => acc + num, 0) / numbers.length;
        setResult(result);
        break;
      case "min":
        result = Math.min(...numbers);
        setResult(result);
        break;
      case "max":
        result = Math.max(...numbers);
        setResult(result);
        break;
      default:
        let formula1;
        let inputs1;

        if (value.length === 0) {
          //@ts-ignore
          formula1 = document.getElementById("formulaInput").value;
          inputs1 = formula1
            .split(/[-+*/]/)
            .filter((item: any) => item.trim() !== "");
        } else {
          formula1 = value.map((option: any) => option.value).join(" ");
          inputs1 = formula1
            .split(/[-+*/]/)
            .filter((item: any) => item.trim() !== "");
        }

        const numbers1 = inputs1.map((input: any) => {
          const userValue = userValues.find(
            ({ name }: { name: string }) => name === input
          );
          return userValue ? userValue.value : parseFloat(input);
        });

        if (numbers1.some(isNaN)) {
          setResult("Invalid input");
          return;
        }

        let result1;

        try {
          result1 = eval(formula1);
        } catch {
          result1 = "Invalid formula";
        }

        setResult(result1);
    }
  };

  return (
    <div>
      <h1>Autocomplete Calculator</h1>
      <CreatableSelect
        options={allSuggestions}
        onChange={onChange}
        value={value}
        isMulti={true}
        isClearable={true}
        maxMenuHeight={150}
        //@ts-ignore
        maxInputLength={100}
        max={5}
        allowCreateWhileLoading={true}
        hideSelectedOptions={false}
      />
      <button className={styles.button} onClick={calculateResult}>
        Calculate
      </button>
      {result !== null && <div className={styles.button}>Result: {result}</div>}

      <h2>Add User Value</h2>
      <input type="text" placeholder="Name" id="userValueName" />
      <input type="number" placeholder="Value" id="userValue" />
      <button
        onClick={() => {
          const name = (
            document.getElementById("userValueName") as HTMLInputElement
          ).value;
          const val = (document.getElementById("userValue") as HTMLInputElement)
            .value;
          if (name && val) {
            addUserValue(name, val);
            (
              document.getElementById("userValueName") as HTMLInputElement
            ).value = "";
            (document.getElementById("userValue") as HTMLInputElement).value =
              "";
          }
        }}
      >
        Add Value
      </button>

      <h2>Current User Values</h2>
      <ul className={styles.listWrapper}>
        {userValues.map(({ name, value }: { name: string; value: string }) => (
          <li key={name}>
            {name}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutocompleteCalculator;
