import React, { useState, useEffect } from "react";
import axios from "axios";
import MonthTable from "@components/month-table";

export default function Home() {
  const [monthTransactions, setMonthTransactions] = useState([]);
  const [monthTotal, setMonthTotal] = useState([]);

  let fetchMonthTransactions = React.useCallback(async () => {
    const response = await axios.get("https://mkhalil.pythonanywhere.com/get_month");
    setMonthTransactions(response.data["month_transactions"]);
    setMonthTotal(response.data["month_total"])
  },[])

  useEffect(() => {
    fetchMonthTransactions();
  }, [fetchMonthTransactions])

  return (
      <MonthTable monthTransactions={monthTransactions} monthTotal={monthTotal} reloadTransactions={fetchMonthTransactions}/>
  )
}
