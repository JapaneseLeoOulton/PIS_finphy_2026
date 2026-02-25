// App.jsx
import React from "react";
import "./App.css";

import FlowchartNav from "./components/FlowchartNav.jsx";
import ParamPanel from "./components/ParamPanel.jsx";
import StepPanel from "./components/StepPanel.jsx";
import Workspace from "./components/Workspace.jsx";

import { useAppStore } from "./state/store.jsx";

export default function App() {
  const { resetParams, writeToHash, resetWorkspace } = useAppStore();

  return (
    <div className="app">
      <header className="header">
        <div className="headerInner">
          <div className="titleBlock">
            <h1 className="title">Physics in Finance — GBM Teaching App</h1>
            <p className="subtitle">Flowchart-driven learning with accumulating visuals</p>
          </div>

          <div className="actions">
            <button className="btn secondary" type="button" onClick={resetWorkspace}>
              Reset Workspace
            </button>
            <button className="btn secondary" type="button" onClick={resetParams}>
              Reset Params
            </button>
            <button className="btn" type="button" onClick={writeToHash}>
              Share Settings
            </button>
          </div>
        </div>
      </header>

      <main className="layout">
        <aside className="left">
          <div className="card">
            <h2 className="cardTitle">Pipeline</h2>
            <FlowchartNav />
          </div>

          <div className="card">
            <h2 className="cardTitle">Parameters</h2>
            <ParamPanel />
          </div>
        </aside>

        <section className="middle">
          <div className="card">
            <h2 className="cardTitle">Step Panel</h2>
            <StepPanel />
          </div>
        </section>

        <aside className="right">
          <div className="card">
            <Workspace />
          </div>
        </aside>
      </main>
    </div>
  );
}