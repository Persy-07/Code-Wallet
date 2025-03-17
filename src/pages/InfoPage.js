import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './assets/styles/InfoPage.css'; 

const InfoPage = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="info-page">
      <Header 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
      />
      
      <main className="content">
        <div className="info-container">
          <h2>About Code Wallet</h2>
          
          <section className="info-section">
            <h3>Features</h3>
            <ul>
              <li>Store and organize code fragments for quick access</li>
              <li>Tag fragments for better organization</li>
              <li>Syntax highlighting for better readability</li>
              <li>Dark mode for comfortable coding at night</li>
              <li>Drag and drop files to quickly create fragments</li>
              <li>Copy code to clipboard with a single click</li>
            </ul>
          </section>
          
          <section className="info-section">
            <h3>Keyboard Shortcuts</h3>
            <table className="shortcuts-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Shortcut</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>New Fragment</td>
                  <td>Ctrl+N</td>
                </tr>
                <tr>
                  <td>Save Fragment</td>
                  <td>Ctrl+S</td>
                </tr>
                <tr>
                  <td>Copy Code</td>
                  <td>Ctrl+C (when code is focused)</td>
                </tr>
                <tr>
                  <td>Toggle Dark Mode</td>
                  <td>Ctrl+D</td>
                </tr>
              </tbody>
            </table>
          </section>
          
          <section className="info-section">
            <h3>About the Developers</h3>
            <p>
              Code Wallet is developed by EverydayDev, a startup focused on creating tools for developers.
              The current team consists of:
            </p>
            <ul>
              <li>Albertine - Director</li>
              <li>Joanne - Commercial</li>
              <li>You - Developer</li>
            </ul>
          </section>
          
          <section className="info-section">
            <h3>Data Management</h3>
            <p>
              All your fragments and tags are stored locally on your computer. 
              No data is sent to any external servers.
            </p>
            <p>
              You can find your data in the application's local storage directory.
              Make sure to back up this directory if you want to preserve your fragments.
            </p>
          </section>
          
          <div className="back-link">
            <Link to="/">Back to Fragments</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfoPage;