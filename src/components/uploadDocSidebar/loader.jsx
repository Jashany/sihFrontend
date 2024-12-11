import { useEffect, useState } from "react";
import ai from "../../assets/svgs/ai.svg";

const Loader = () => {
  const [progress, setProgress] = useState([0, 0, 0]);
  const [currentStage, setCurrentStage] = useState(0); 

  useEffect(() => {
    const arr = [100, 200, 300, 400, 500, 600, 700, 800];
    const randomIndex = Math.floor(Math.random() * arr.length);
    const timeout = arr[randomIndex];
    console.log(timeout)
    const interval = setInterval(() => {
      setProgress((prev) => {
        const updatedProgress = [...prev];

        if (updatedProgress[currentStage] < 100) {
          updatedProgress[currentStage] += 10;
        }

        if (updatedProgress[currentStage] === 100 && currentStage < 2) {
          setCurrentStage(currentStage + 1);
        }

        return updatedProgress;
      });
    }, timeout);

    return () => clearInterval(interval);
  }, [currentStage]);

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex flex-col m-auto bg-PrimaryGrayDark px-20 py-10 w-1/2 items-center rounded-2xl">
        <div className="flex flex-col items-center">
          <img src={ai} width={50} height={50} alt="Generating" />
          <h1 className="text-4xl">Generating Summary</h1>
        </div>
        <div>
          <div className="flex gap-16 mt-5">
            <LoaderBar title="Uploading" progress={progress[0]} />
            <LoaderBar title="Summarizing" progress={progress[1]} />
            <LoaderBar title="Finalizing" progress={progress[2]} />
          </div>
        </div>
      </div>
    </div>
  );
};

const LoaderBar = ({ title, progress }) => {
  return (
    <div className="flex flex-col w-36">
      <p className="text-PrimaryGrayTextLight text-center">{title}</p>
      <div className="flex items-center mt-1">
        <div
          className={`w-5 h-5 rounded-full ${
            progress > 0 ? "bg-PrimaryBlue" : "bg-PrimaryGrayLight"
          }`}
        ></div>
        <div className="w-5/6 h-1 -ml-1 rounded-full overflow-hidden">
          <div
            className="bg-PrimaryBlue h-1 rounded-full"
            style={{
              width: `${progress}%`,
              transition: "width 0.5s ease",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
