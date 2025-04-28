import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Graph from "react-graph-vis";
import axios from "axios";
import backendUrl from "../utils/common";

// Import CSS for react-graph-vis
import "vis-network/dist/dist/vis-network.min.css";
import "./tokenTraders.css";

const TokenTraders = () => {
  const { mint } = useParams();
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stabilizing, setStabilizing] = useState(false);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/sol/token-traders?mint=${mint}`);
        
        const processedData = {
          ...response.data,
          nodes: response.data.nodes.map(node => ({
            ...node,
            label: node.label ? `${node.label}\n${node.id.substring(0, 8)}...` : `${node.id.substring(0, 8)}...`,
            font: {
              size: 14,
              face: "Segoe UI",
              color: "#000000",
              multi: 'html',
              bold: {
                color: '#000000',
                size: 16,
                face: 'Segoe UI'
              }
            }
          }))
        };
        
        setGraphData(processedData);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mint) {
      fetchGraphData();
    }
  }, [mint]);

  const options = {
    layout: {
      hierarchical: false,
      improvedLayout: true,
      randomSeed: 42,
    },
    edges: {
      color: "#000000",
      width: 2,
      smooth: {
        type: "cubicBezier",
        forceDirection: "none",
        roundness: 0.5,
      },
      arrows: {
        to: {
          enabled: true,
          scaleFactor: 0.5
        }
      },
      length: 250, // Increase the preferred length of edges
    },
    nodes: {
      shape: "circle",
      size: 35,
      font: {
        size: 14,
        face: "Segoe UI",
        color: "#000000",
        multi: true
      },
      borderWidth: 2,
      shadow: {
        enabled: true,
        color: 'rgba(0,0,0,0.2)',
        size: 5,
        x: 2,
        y: 2
      },
      margin: 12, // Add margin around the node
    },
    physics: {
      enabled: true,
      solver: "forceAtlas2Based",
      forceAtlas2Based: {
        gravitationalConstant: -1500,
        centralGravity: 0.005,
        springLength: 350,
        springConstant: 0.05,
        damping: 0.3,
        avoidOverlap: 1.2
      },
      stabilization: {
        enabled: true,
        iterations: 1500,
        updateInterval: 50
      },
      maxVelocity: 30,
      minVelocity: 0.1,
    },
    height: "100vh",
    width: "100%",
    interaction: {
      hover: true,
      tooltipDelay: 200,
      zoomView: true,
      dragView: true,
      navigationButtons: true,
      keyboard: true
    },
    background: "#ffffff",
  };

  const events = {
    select: function (event) {
      const { nodes } = event;
      if (nodes.length > 0) {
        const nodeId = nodes[0];
        const selectedNodeData = graphData.nodes.find((node) => node.id === nodeId);
        if (selectedNodeData) {
          setSelectedNode(selectedNodeData);
          setModalOpen(true);
        }
      }
    },
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="token-traders-container">
      <h1 className="token-traders-title">
        Token Traders for {mint}
      </h1>
      
      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="graph-container">
          {stabilizing && (
            <div className="stabilizing-indicator">
              <div className="stabilizing-spinner"></div>
              <p>Optimizing layout...</p>
            </div>
          )}
          <Graph
            graph={graphData}
            options={options}
            events={events}
            getNetwork={(network) => {
              // Handle network stabilization
              setStabilizing(true);
              network.on("stabilizationProgress", function(params) {
                // Optional: Show progress
              });
              network.on("stabilizationIterationsDone", function() {
                setStabilizing(false);
              });
              
              setTimeout(() => {
                network.fit({
                  animation: {
                    duration: 1000,
                    easingFunction: "easeInOutQuad"
                  }
                });
              }, 500);
            }}
          />
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {selectedNode && (
              <>
                <div className="modal-header">
                  <h2>Node Details</h2>
                  <button className="close-button" onClick={handleCloseModal}>×</button>
                </div>
                <div className="modal-body">
                  <p><strong>Address:</strong> {selectedNode.id}</p>
                  <p><strong>Label:</strong> {selectedNode.label}</p>
                  {selectedNode.balance && (
                    <p><strong>Balance:</strong> {selectedNode.balance}</p>
                  )}
                  {selectedNode.color && (
                    <div className="color-display">
                      <p><strong>Color:</strong></p>
                      <div 
                        className="color-circle"
                        style={{ backgroundColor: selectedNode.color }}
                      ></div>
                    </div>
                  )}
                  {selectedNode.size && (
                    <p><strong>Size:</strong> {selectedNode.size}</p>
                  )}
                  {/* Display any additional node properties here */}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenTraders;