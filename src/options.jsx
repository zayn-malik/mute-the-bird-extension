import { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Switch } from "@headlessui/react";
import { useForm } from "react-hook-form";

function MyToggle() {
  // function initialize() {
  //   chrome.storage.local.get("debug", function (result) {
  //     console.log(Boolean(result));
  //     return Boolean(result);
  //   });
  // }

  // const [enabled, setEnabled] = useState(initialize ?? false);
  const [enabled, setEnabled] = useState(false);

  // function handleOnChange(params) {
  //   setEnabled((current) => !current);
  // }

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // 👈️ return early if first render
    }
    chrome.storage.local.set({ debug: enabled });
  }, [enabled]);

  return (
    <>
      <span className="dark:text-white">Debug mode</span>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? "bg-blue-600" : "bg-gray-200"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span
          className={`${
            enabled ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
      <span className="dark:text-white">
        {enabled ? "enabled" : "disabled"}
      </span>
    </>
  );
}

function OptionForm() {
  const [value, setValue] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    chrome.storage.local.set({ bearer: data.token }, () => {
      // window.close();
    });
  };

  console.log(watch("token"));

  return (
    <div className="mx-auto mt-10 grid grid-flow-row auto-rows-max justify-items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="" id="myForm">
        <input
          className="mt-1 w-72 rounded-md border border-slate-300 bg-inherit py-2 text-slate-800 shadow-sm placeholder:text-center placeholder:italic placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-900 disabled:shadow-none dark:bg-white sm:text-sm"
          placeholder="bearer token"
          id="token"
          name="name"
          {...register("token")}
        />

        <input
          className="mt-3 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-300 focus:ring focus:ring-blue-300 active:bg-blue-700"
          type="submit"
        />
      </form>

      <form
        id="optionsForm"
        className="mt-10 grid grid-flow-row auto-rows-max justify-items-center dark:text-white"
      >
        <MyToggle />
      </form>
    </div>
  );
}

function App() {
  return <OptionForm />;
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
