import { UilTimes } from "@iconscout/react-unicons";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import Chart from "react-apexcharts";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Card.css";

// parent Card

const Card = (props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <AnimatePresence>
    {expanded && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="expanded-card"
      >
        <ExpandedCard param={props} setExpanded={() => setExpanded(false)} />
      </motion.div>
    )}
    {!expanded && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="compact-card"
      >
        <CompactCard param={props} setExpanded={() => setExpanded(true)} />
      </motion.div>
    )}
  </AnimatePresence>
  );
};

// Compact Card
function CompactCard({ param, setExpanded }) {
  const Png = param.png;
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard"
      onClick={setExpanded}
    >
      <div className="radialBar">
        <CircularProgressbar
          value={param.barValue}
          text={`${param.barValue}%`}
        />
        <span>{param.title}</span>
      </div>
      <div className="detail">
        <Png />
        <span>{param.value}</span>
        <span>Last 5 years</span>
      </div>
    </motion.div>
  );
}

// Expanded Card
function ExpandedCard({ param, setExpanded }) {
  const data = {
    optionsBar: {
      chart: {
        type: "bar",
        height: 1400,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "35%",
          columnHeight: "125%",
          endingShape: "rounded",
        },},
      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 5,
        colors: ["transparent"],
      },
      tooltip: {
        x: {
          format: "mention",
        },
      },
      grid: {
        show: true,
      },
      yaxis: {
        title: {
          text: "Value",
        },
        
      },
      xaxis: {
        type: "mention", // Use "category" type for string categories
        categories: ["Fairly good honours", "good", "Excellent honours", "Normal", "Failed", "bad"], // Update with your string categories
      },
    },
    optionsChart: {
        chart: {
          type: "area",
          height: "auto",
        },
  
        dropShadow: {
          enabled: false,
          enabledOnSeries: undefined,
          top: 0,
          left: 0,
          blur: 3,
          color: "#000",
          opacity: 0.35,
        },
  
        fill: {
          colors: ["#fff"],
          type: "gradient",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          colors: ["white"],
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
        grid: {
          show: true,
        },
        xaxis: {
          type: "datetime",
          categories: [
            "2018",
            "2019",
            "2020",
            "2021",
            "2022",
            "2023",
            "2024",
          ],}
        
      }
  }
  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard"
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={setExpanded} />
      </div>
        <span>{param.title}</span>
      <div className="chartContainer">
      {param.type === "bar" ? (
  <Chart options={data.optionsBar} series={param.series} type="bar" />
) : (
  <Chart options={data.optionsChart} series={param.series} type="area" />
)}

      </div>
      <span>Last 5 years</span>
    </motion.div>
  );
}

export default Card;