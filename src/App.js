import React from 'react';

import './App.css';

function App() {
  return (
    <div className="App">

      <div>
        {viewPoints()}
      </div>
      <div>
        {viewAllTransactionWithRewardPoints()}
      </div>
    </div>
  );
}

// view all customers' transactions along with the rewarded points per purchase amount
function viewAllTransactionWithRewardPoints() {
  const data = getTransactions();
  const listItems = data.map(
    (d) =>
      <tr>
        <td>{d.date.toISOString().slice(0, 10)}</td>
        <td>{d.customer}</td>
        <td>{d.amount}</td>
        <td>{calculateRewardedPoint(d.amount)}</td>
      </tr>
  );

  return (
    <div class="report">
      <p>PURCHASE HISTORY:</p>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Customer</th>
            <th scope="col">Purchase Amount</th>
            <th scope="col">Points Earned</th>
          </tr>
        </thead>
        <tbody>
          {listItems}
        </tbody>
      </table>
    </div>
  );
}

// view monthly points rewarded
function viewPoints() {
  const data = processTransactions();
  const listItems = data.map(
    (d) =>
      <tr><td>{d.customer}</td><td>{d.point}</td>
        <td>{d.date.getMonth() + 1}</td>
        <td>{d.total}</td>
      </tr>
  );

  return (
    <div class="report">
      <p>POINTS REWARDED SUMMARY:</p>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Customer</th>
            <th scope="col">Reward Point</th>
            <th scope="col">Month</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {listItems}
        </tbody>
      </table>
    </div>
  );
}

// calculate monthly points rewarded
function processTransactions() {
  var
    result = [];
  const threeMonthTransactions = getTransactions();
  for (var i = 0; i < threeMonthTransactions.length; i++) {
    var reward = calculateRewardedPoint(threeMonthTransactions[i].amount);
    var tran = threeMonthTransactions[i];
    const position = search(tran.customer, tran.date.getMonth(), result);
    if (position >= 0) {
      var accumulated_point = result[position].point + reward;
      result[position].point = accumulated_point;
    }
    else {
      var element = {};
      element.customer = threeMonthTransactions[i].customer;
      element.point = reward;
      element.date = threeMonthTransactions[i].date;
      element.total = "";
      result.push(element);
    }
  }
  result.sort(compare);
  var acc = result[0].point;
  var current_tran = result[0];
  var last_element = { customer: "", point: 0, date: new Date(), total: "" };
  result.push(last_element);

  for (var index = 1; index < result.length; index++) {
    if (result[index].customer == current_tran.customer) {
      acc += result[index].point;
    }
    else {
      result[index - 1].total = acc;
      acc = result[index].point;
    }
    current_tran = result[index];
  }
  result.pop();
  return result;
}

function search(name, month, transaction_array) {
  if (transaction_array.length === 0) {
    return -1;
  }
  for (var i = 0; i < transaction_array.length; i++) {
    if (transaction_array[i].customer === name && transaction_array[i].date.getMonth() == month) {
      return i;
    }
  }
}

/* calculate the awarded points based on purchase
  input: purchase amount
  output: rewarded points
*/
function calculateRewardedPoint(purchaseAmount) {
  if (purchaseAmount >= 50 && purchaseAmount < 100) {
    return purchaseAmount - 50;
  } else if (purchaseAmount > 100) {
    return 50 + (purchaseAmount - 100) * 2;
  }
  return 0;
}

// sample data
function getTransactions() {
  var transaction01 = { customer: "John", amount: 120, date: new Date("2019-08-02") };
  var transaction02 = { customer: "John", amount: 450, date: new Date("2019-08-08") };
  var transaction03 = { customer: "John", amount: 340, date: new Date("2019-08-15") };
  var transaction04 = { customer: "Sam", amount: 75, date: new Date("2019-09-01") };
  var transaction05 = { customer: "Tim", amount: 85, date: new Date("2019-09-09") };
  var transaction06 = { customer: "John", amount: 168, date: new Date("2019-09-18") };
  var transaction07 = { customer: "Larry", amount: 250, date: new Date("2019-09-25") };
  var transaction08 = { customer: "John", amount: 230, date: new Date("2019-10-01") };
  var transaction09 = { customer: "Sam", amount: 175, date: new Date("2019-10-07") };
  var transaction10 = { customer: "Don", amount: 90, date: new Date("2019-10-12") };
  var transaction11 = { customer: "John", amount: 110, date: new Date("2019-10-17") };
  var transaction12 = { customer: "Don", amount: 148, date: new Date("2019-10-28") };
  var transactions = [transaction01, transaction02, transaction03, transaction04, transaction05, transaction06, transaction07, transaction08, transaction09, transaction10, transaction11, transaction12];
  return transactions;
}

// to sort the result
function compare(a, b) {
  const nameA = a.customer.toUpperCase();
  const nameB = b.customer.toUpperCase();
  let comparison = 0;
  if (nameA > nameB) {
    comparison = 1;
  } else if (nameA < nameB) {
    comparison = -1;
  }
  return comparison;
}

export default App;
