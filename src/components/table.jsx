// Table.js
import React, { useEffect, useState } from "react";
import "./table.css";
import InputBox from "./inputBox";
import Pagination from "./pagination";

const Table = () => {
  const [tableData, setTableData] = useState(
    JSON.parse(localStorage.getItem("tableData")) || []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAllChecked, setSelectAllChecked] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRowId, setEditingRowId] = useState(null); // Track editing row
  const rowsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const jsonData = await response.json();
      setTableData(jsonData);
      // Update localStorage with fetched data
      localStorage.setItem("tableData", JSON.stringify(jsonData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Check if data exists in localStorage
    const localTableData = JSON.parse(localStorage.getItem("tableData"));
    if (localTableData) {
      setTableData(localTableData);
    } else {
      // Fetch data from API if not found in localStorage
      fetchData();
    }
  }, []);

  // Update localStorage whenever tableData changes
  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
  }, [tableData]);

  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (newPage) => {
    setSelectAllChecked([]);
    setCurrentPage(newPage);
  };

  const CheckAllTheRows = () => {
    if (selectAllChecked.length === currentRows.length) {
      setSelectAllChecked([]);
      setSelectedRows([]);
    } else {
      const allRowIds = currentRows.map((row) => row.id);
      setSelectAllChecked(allRowIds);
      setSelectedRows(allRowIds);
    }
  };

  const handleRowCheck = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const deleteOneRow = (rowId) => {
    const updatedTableData = tableData.filter((row) => row.id !== rowId);
    setTableData(updatedTableData);
  };

  const handleEdit = (id) => {
    setEditingRowId(id);
  };

  const handleEditInputChange = (id, fieldName, value) => {
    const updatedTableData = tableData.map((row) =>
      row.id === id ? { ...row, [fieldName]: value } : row
    );
    setTableData(updatedTableData);
  };

  const handleSaveEdit = (id) => {
    setEditingRowId(null);

    const editedRow = tableData.find((row) => row.id === id);

    const updatedTableData = tableData.map((row) =>
      row.id === id ? editedRow : row
    );

    setTableData(updatedTableData);
  };

  const handleCancelEdit = (id) => {
    setEditingRowId(null);
  };

  const handleDeleteSelected = () => {
    const updatedTableData = tableData.filter(
      (row) => !selectedRows.includes(row.id)
    );
    setTableData(updatedTableData);

    setSelectedRows([]);
  };

  const handleSearch = (event) => {
    setCurrentPage(1);
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <InputBox handleSearch={handleSearch} searchQuery={searchQuery} />
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                id="selectAll"
                name="selectAll"
                value="All"
                checked={selectAllChecked.length === currentRows.length}
                onChange={CheckAllTheRows}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr key={row.id} className={selectedRows.includes(row.id) ? "selected-row" : ""}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleRowCheck(row.id)}
                />
              </td>
              <td>
                {editingRowId === row.id ? (
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) =>
                      handleEditInputChange(row.id, "name", e.target.value)
                    }
                  />
                ) : (
                  row.name
                )}
              </td>
              <td>
                {editingRowId === row.id ? (
                  <input
                    type="text"
                    value={row.email}
                    onChange={(e) =>
                      handleEditInputChange(row.id, "email", e.target.value)
                    }
                  />
                ) : (
                  row.email
                )}
              </td>
              <td>
                {editingRowId === row.id ? (
                  <input
                    type="text"
                    value={row.role}
                    onChange={(e) =>
                      handleEditInputChange(row.id, "role", e.target.value)
                    }
                  />
                ) : (
                  row.role
                )}
              </td>
              <td>
                <div className="icons">
                  {editingRowId === row.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(row.id)}
                      >
                        <i className="fa-solid fa-check"></i> Save
                      </button>
                      <button
                        onClick={() => handleCancelEdit(row.id)}
                      >
                        <i className="fa-solid fa-window-close"></i> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(row.id)}>
                        <i className="fa-solid fa-pencil"></i> Edit
                      </button>
                      <button
                        onClick={() => deleteOneRow(row.id)}
                        style={{ color: 'red' }}
                      >
                        <i className="fa-solid fa-trash"></i> Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={Math.ceil(filteredData.length / rowsPerPage)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onDeleteSelected={handleDeleteSelected}
      />
    </div>
  );
};

export default Table;
