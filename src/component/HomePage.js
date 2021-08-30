import React, { useState } from "react";
import { useEffect } from "react";

const HomePage = () => {
  const [zipCode, setZipCode] = useState();
  const [data, setData] = useState(null);
  const [select, setSelect] = useState(null);
  const [error, setError] = useState(false);

  const combinedItems = (arr = [], value) => {
    let flag = false;
    var main = {};
    let t = 0;
    const keys = Object.keys(arr[0]);
    for (let i = 0; i < arr.length; i++) {
      if (i == arr.length - 1) t = i;
      if (arr[i][value] === arr[t != 0 ? t : i + 1][value]) {
        main[value] = arr[i][value];
      }

      for (let j = 0; j < keys.length; j++) {
        if (arr[i][keys[j]] != arr[t != 0 ? t : i + 1][keys[j]]) {
          if (arr[i][keys[j]] && arr[t != 0 ? t : i + 1][keys[j]]) {
            if (!main[keys[j]]) {
              flag = true;
              if (
                typeof arr[i][keys[j]] != "object" &&
                keys[j] != "id" &&
                !keys[j].includes("$")
              ) {
                if (
                  keys[j] === "Phone_2" ||
                  keys[j] === "Phone_2" ||
                  "Email" ||
                  "Secondary_Email"
                ) {
                  main[keys[j]] = arr[i][keys[j]];
                } else {
                  main[keys[j]] =
                    arr[i][keys[j]] + ", " + arr[t != 0 ? t : i + 1][keys[j]];
                }
              }
            } else if (flag)
              if (
                typeof arr[i][keys[j]] != "object" &&
                keys[j] != "id" &&
                !keys[j].includes("$")
              ) {
                if (
                  keys[j] === "Phone_2" ||
                  keys[j] === "Phone_2" ||
                  "Email" ||
                  "Secondary_Email"
                ) {
                  main[keys[j]] = arr[i][keys[j]];
                } else
                  main[keys[j]] =
                    main[keys[j]] + ", " + arr[t != 0 ? t : i + 1][keys[j]];
              }
          } else {
            if (!main[keys[j]]) {
              if (
                typeof arr[i][keys[j]] != "object" &&
                !keys[j].includes("$")
              ) {
                if (
                  keys[j] === "Phone_2" ||
                  keys[j] === "Phone_2" ||
                  keys[j] === "Email" ||
                  keys[j] === "Secondary_Email"
                ) {
                  main[keys[j]] = arr[i][keys[j]];
                } else
                  main[keys[j]] =
                    arr[i][keys[j]] === null
                      ? arr[t != 0 ? t : i + 1][keys[j]]
                      : arr[i][keys[j]];
              }
            } else {
              if (
                keys[j] === "Phone_2" ||
                keys[j] === "Phone_2" ||
                "Email" ||
                "Secondary_Email"
              ) {
                main[keys[j]] = arr[i][keys[j]];
              } else
                main[keys[j]] =
                  main[keys[j]] +
                  ", " +
                  (arr[i][keys[j]] === null
                    ? arr[t != 0 ? t : i + 1][keys[j]]
                    : arr[i][keys[j]]);
            }
          }
        }
        if (arr[i][keys[j]] === arr[t != 0 ? t : i + 1][keys[j]]) {
          if (!main[keys[j]])
            if (typeof arr[i][keys[j]] != "object" && !keys[j].includes("$"))
              main[keys[j]] = arr[i][keys[j]];
        }
      }
    }
    return main;
  };

  const deleteRecord = (id) => {
    console.log("Deleting record: " + id);
    ZOHO.CRM.API.deleteRecord({ Entity: "Leads", RecordID: id })
      .then(function (data) {
        console.log("Deleted", data);
      })
      .catch((err) => {
        console.log("Delete", err);
      });
  };

  const handleMergeClick = (event) => {
    console.log(select);
    if (data) {
      let result = [combinedItems(data, "Zip_Code")];
      result[0].id = select;
      let postData = JSON.stringify(result[0]);
      postData = JSON.parse(postData);
      console.log(postData, select);
      var config = {
        Entity: "Leads",
        APIData: postData,
        Trigger: ["workflow"],
      };
      ZOHO.CRM.API.updateRecord(config)
        .then(function (updateRec) {
          if ((updateRec.data[0].code = "SUCCESS")) {
            console.log("Setting flag to true");
            data?.forEach((record) => {
              if (record.id !== select) {
                console.log("Calling Delete Function");
                deleteRecord(record.id);
              }
            });
          } else {
            console.log("error dekao");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSelect = (event) => {
    let count = 0;
    if (data) {
      data?.map((user, index) => {
        let temp = document.getElementById("" + user.id);
        if (temp.checked) {
          count = count + 1;
          if (count <= 1) {
            setError(false);
            setSelect(user.id);
          } else {
            setError(true);
          }
          console.log(temp.checked, user.id);
        }
      });
    }
  };

  const handleZipcodeChange = (event) => {
    setZipCode(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(zipCode);
    ZOHO.CRM.API.searchRecord({
      Entity: "Leads",
      Type: "criteria",
      Query: "(Zip_Code:equals:" + zipCode + ")",
    }).then(function (searchResult) {
      console.log(searchResult);
      setData(searchResult.data);
    });
  };

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      console.log(data);
    });
    /*
     * initializing the widget.
     */
    ZOHO.embeddedApp.init();
  }, []);

  return (
    <div className="container mt-sm-4">
      <form onSubmit={handleSubmit}>
        <div className="col-12">
          <label className="visually-hidden" htmlFor="ZipCode">
            ZipCode
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="ZipCode"
              placeholder="ZipCode"
              value={zipCode}
              onChange={handleZipcodeChange}
            />
          </div>
          <div id="errorConsole"></div>
        </div>
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary" id="find-button">
            Find Duplicate
          </button>
        </div>
      </form>
      <div id="no-record-alert" className="mt-5">
        <p id="no-record"></p>
      </div>
      <h1>Found Duplicate Records</h1>
      {data?.length > 0 && (
        <div>
          <h3>
            Please select one row to merge rest of the rows onto the selected
            row.
          </h3>
        </div>
      )}
      <table>
        <tr>
          <th scope="col">Select</th>
          <th scope="col">ID</th>
          <th scope="col">Country</th>
          <th scope="col">Email</th>
          <th scope="col">Zip</th>
        </tr>

        {data?.map((user, index) => (
          <tr>
            <td>
              <input
                class="checkRec"
                id={user?.id}
                type="checkbox"
                onChange={handleSelect}
                value={select}
              />
            </td>
            <td>{user?.id}</td>
            <td>{user?.Country}</td>
            <td>{user?.Email}</td>
            <td>{user?.Zip_Code}</td>
          </tr>
        ))}
      </table>

      <div>
        {select && !error && (
          <button id="merge-btn" onClick={handleMergeClick}>
            Merge Associate Rows
          </button>
        )}
      </div>

      <div>{error && <p>Can not select multiple records.</p>}</div>
    </div>
  );
};
export default HomePage;
