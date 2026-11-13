import { useEffect, useState } from "react";
import logo from "../../../../assets/images/logo/hmif-animated-logo.svg";
import "./Preloader.css";

export default function Preloader({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let pageLoaded = document.readyState === "complete";
    let minimumElapsed = false;
    let completed = false;
    let exitTimer;

    const finishLoading = () => {
      if (!pageLoaded || !minimumElapsed || completed) return;

      completed = true;
      setIsExiting(true);

      exitTimer = window.setTimeout(() => {
        onComplete?.();
      }, 600);
    };

    const handleLoad = () => {
      pageLoaded = true;
      finishLoading();
    };

    const minimumTimer = window.setTimeout(() => {
      minimumElapsed = true;
      finishLoading();
    }, 1400);

    if (!pageLoaded) {
      window.addEventListener("load", handleLoad);
    } else {
      finishLoading();
    }

    return () => {
      window.clearTimeout(minimumTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("load", handleLoad);
    };
  }, [onComplete]);

  return (
    <div className={`hmif-preloader ${isExiting ? "is-exiting" : ""}`}>
      <div className="preloader-content">
        <div className="preloader-logo-wrapper">
          <img src={logo} alt="Logo HMIF UNIBA" className="preloader-logo" />
        </div>

        <div className="preloader-loading">
          <div className="loading-line">
            <span />
          </div>
          <p>MEMUAT HALAMAN</p>
        </div>
      </div>
    </div>
  );
}
