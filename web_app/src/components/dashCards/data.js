// Sidebar imports
import {
  UilClipboardAlt
} from "@iconscout/react-unicons";
  
  // Analytics Cards imports
  import { UilMoneyWithdrawal, UilUsdSquare } from "@iconscout/react-unicons";

  // Analytics Cards Data
  export const cardsData = [
    {
      title: "Verified Diploma",
      color: {
        backGround: "linear-gradient(180deg, #D4DDEE 0%, #809BCE 100%)",
        boxShadow: "0px 10px 20px 0px #D4DDEE",
      },
      barValue: 70,
      value: "225",
      png: UilUsdSquare,
      series: [
        {
          name: "Sales",
          data: [31, 40, 28, 51, 42, 109, 100],
        },
      ],
      type:"bar"
    },
    {
      title: "Verified certificate",
      color: {
        backGround: "linear-gradient(180deg, #FFF2C6 0%, #FFE073 100%)",
        boxShadow: "0px 10px 20px 0px #FFF2C6",
      },
      barValue: 80,
      value: "2568",
      png: UilMoneyWithdrawal,
      series: [
        {
          name: "Verified Diploma last 5 years",
          data: [10, 100, 50, 70, 80, 30, 40],
        },
      ],
      type:"chart"
    },
    {
      title: "Transactions",
      color: {
        backGround:
          "linear-gradient(180deg,#FFE0D3 0%, #FD7238 100%)",
        boxShadow: "0px 10px 20px 0px #FFE0D3",
      },
      barValue: 10,
      value: "1557",
      png: UilClipboardAlt,
      series: [
        {
          name: "students",
          data: [10, 25, 15, 30, 12, 15, 20],
        },
      ],
      type:"bar"
    },
    {
      title: "conferences",
      color: {
        backGround:
          "linear-gradient(#9FD9AF 0%, #53BB6F 100%)",
        boxShadow: "0px 10px 20px 0px #C5E8CF",
      },
      barValue: 30,
      value: "128",
      png: UilClipboardAlt,
      series: [
        {
          name: "Excellent Mention Diploma",
          data: [10, 25, 15, 30, 12, 15, 20],
        },
      ],
      type:"chart"
    }, 
  ];