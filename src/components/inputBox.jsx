// InputBox.js
import React from 'react';
import './InputBox.css';

const InputBox = ({ handleSearch, searchQuery }) => {
  return (
    <div className="input-box-container">
      <input
        type="text"
        placeholder='Search by name, email, or role'
        className="search-input"
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
  );
}

export default InputBox;
