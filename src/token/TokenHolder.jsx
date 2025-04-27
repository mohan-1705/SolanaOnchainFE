import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Graph from "react-graph-vis";
import "./network.css";

export default function TokenHolder() {
  const { mint } = useParams();
  const [holders, setHolders] = useState([]);
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/solana/top-holders?mint=${mint}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched holders:', data.data);
        setHolders(data.data);
      });
  }, [mint]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Shortened address
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Prepare data for the graph visualization
  const prepareGraphData = () => {
    if (!holders || !holders.length) return { nodes: [], edges: [] };
    
    // Sort holders by valueUsd descending and take top 100
    const sortedHolders = [...holders]
      .sort((a, b) => parseFloat(b.valueUsd) - parseFloat(a.valueUsd))
      .slice(0, 100);
    
    // Get percentage values for scaling
    const percentageValues = sortedHolders.map(h => h.percentageOfSupplyHeld);
    const maxPercentage = Math.max(...percentageValues) || 1;
    
    // More dramatic size scaling based on percentage held
    const getSize = (percentage) => {
      // Define size tiers based on percentage of total supply
      if (percentage > 50) {
        return 300; // Extremely large for majority holders (>50%)
      } else if (percentage > 25) {
        return 220; // Very large for significant holders (25-50%)
      } else if (percentage > 10) {
        return 180; // Large for notable holders (10-25%)
      } else if (percentage > 5) {
        return 150; // Medium-large for important holders (5-10%)
      } else if (percentage > 1) {
        return 120; // Medium for minor holders (1-5%)
      } else if (percentage > 0.5) {
        return 90; // Small-medium for tiny holders (0.5-1%)
      } else if (percentage > 0.1) {
        return 80; // Small for micro holders (0.1-0.5%)
      } else {
        return 50; // Tiny for dust holders (<0.1%)
      }
    };
    
    const nodeColor = {
      background: "rgba(124, 58, 237, 0.7)",
      border: "#f472b6",
      highlight: {
        background: "rgba(124, 58, 237, 0.9)",
        border: "#f472b6"
      },
      hover: {
        background: "rgba(124, 58, 237, 0.8)",
        border: "#f472b6"
      }
    };
    
    const nodes = sortedHolders.map((holder, i) => {
      const value = parseFloat(holder.valueUsd);
      const percentage = holder.percentageOfSupplyHeld;
      
      // Get a color based on percentage tier
      let bubbleColor = {...nodeColor};
      
      if (percentage > 50) {
        bubbleColor = { 
          background: "rgba(255, 0, 0, 0.6)", 
          border: "#ff0000",
          highlight: {
            background: "rgba(255, 0, 0, 0.8)",
            border: "#ff0000"
          },
          hover: {
            background: "rgba(255, 0, 0, 0.7)",
            border: "#ff0000"
          }
        };
      } else if (percentage > 25) {
        bubbleColor = { 
          background: "rgba(255, 140, 0, 0.6)", 
          border: "#ff8c00",
          highlight: {
            background: "rgba(255, 140, 0, 0.8)",
            border: "#ff8c00"
          },
          hover: {
            background: "rgba(255, 140, 0, 0.7)",
            border: "#ff8c00"
          }
        };
      } else if (percentage > 10) {
        bubbleColor = { 
          background: "rgba(255, 215, 0, 0.6)", 
          border: "#ffd700",
          highlight: {
            background: "rgba(255, 215, 0, 0.8)",
            border: "#ffd700"
          },
          hover: {
            background: "rgba(255, 215, 0, 0.7)",
            border: "#ffd700"
          }
        };
      }
      
      // Calculate font size based on node size
      const fontSize = Math.max(14, Math.min(22, getSize(percentage) / 8));
      
      return {
        id: holder.ownerAddress,
        label: holder.ownerName || shortenAddress(holder.ownerAddress),
        title: `${holder.ownerName || 'Wallet #' + holder.rank} - ${formatCurrency(value)} (${percentage.toFixed(2)}%)`,
        value: value,
        size: getSize(percentage),
        color: bubbleColor,
        font: {
          size: fontSize,
          color: "#ffffff",
          bold: true,
          strokeWidth: 2,
          strokeColor: "rgba(0,0,0,0.4)"
        },
        rank: holder.rank,
        valueUsd: holder.valueUsd,
        percentage: holder.percentageOfSupplyHeld,
        physics: true,
      };
    });
    
    // No edges as per requirement
    return { nodes, edges: [] };
  };

  // Handle node selection
  const handleSelect = (event) => {
    const { nodes } = event;
    if (nodes.length > 0) {
      const selectedNodeId = nodes[0];
      const holder = holders.find(h => h.ownerAddress === selectedNodeId);
      if (holder) {
        setSelected(holder);
        setModalOpen(true);
      }
    }
  };

  // Handle list item click
  const handleListItemClick = (holder) => {
    setSelected(holder);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setSelected(null);
    setModalOpen(false);
  };

  // Graph options
  const options = {
    autoResize: true,
    height: `${dimensions.height}px`,
    width: `${dimensions.width}px`,
    nodes: {
      shape: "dot",
      scaling: {
        min: 35,
        max: 300, // Increased range for more dramatic size differences
      },
      borderWidth: 1,
      borderWidthSelected: 3,
      shadow: {
        enabled: true,
        color: "rgba(0,0,0,0.3)",
        size: 10,
        x: 0,
        y: 0
      },
      font: {
        face: "Inter",
        color: "#ffffff",
      },
    },
    physics: {
      enabled: true,
      barnesHut: {
        gravitationalConstant: -2000,
        centralGravity: 0.1,
        springLength: 250, // Increased to give more space between nodes
        springConstant: 0.01,
        damping: 0.09,
        avoidOverlap: 0.5, // Increased to prevent overlap of different sized nodes
      },
      repulsion: {
        centralGravity: 0.0,
        springLength: 300,
        springConstant: 0.01,
        nodeDistance: 350, // Increased for better spacing
        damping: 0.09
      },
      solver: 'barnesHut',
      stabilization: {
        enabled: true,
        iterations: 1000,
        updateInterval: 100,
        onlyDynamicEdges: false,
        fit: true
      },
    },
    interaction: {
      hover: true,
      tooltipDelay: 200,
      hideEdgesOnDrag: true,
      zoomView: true,
    },
  };

  // Event handlers
  const events = {
    select: handleSelect
  };

  // Colors
  const bgColor = "#0f172a"; // Darker blue background
  const accent = "#f472b6";
  const textColor = "#fff";
  const muted = "#94a3b8";
  const cardBg = "#1e293b";

  // Get sorted holders for the list view
  const getSortedHolders = () => {
    if (!holders || !holders.length) return [];
    return [...holders]
      .sort((a, b) => parseFloat(b.valueUsd) - parseFloat(a.valueUsd))
      .slice(0, 30); // Limit to top 30 for the side list
  };
  
  // Get color and label based on percentage tier
  const getPercentageTierInfo = (percentage) => {
    if (percentage > 50) {
      return { color: '#ff0000', label: 'Majority Holder' };
    } else if (percentage > 25) {
      return { color: '#ff8c00', label: 'Major Holder' };
    } else if (percentage > 10) {
      return { color: '#ffd700', label: 'Significant Holder' };
    } else {
      return { color: accent, label: '' };
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        minHeight: "100vh", 
        width: "100vw", 
        background: bgColor, 
        display: "flex", 
        position: "relative", 
        fontFamily: 'Inter, sans-serif', 
        overflow: 'hidden',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(124, 58, 237, 0.1) 0%, rgba(15, 23, 42, 0) 70%), radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.1) 0%, rgba(15, 23, 42, 0) 70%)',
        backgroundSize: 'cover',
      }}
    >
      {/* Graph Visualization Area */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        position: "relative", 
        marginRight: "300px" // Make space for the side panel
      }}>
        <div style={{ position: "absolute", top: 40, left: 60, color: textColor, zIndex: 5 }}>
          <h2 style={{ fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>Token Holders Network</h2>
          <p style={{ color: muted, marginTop: 8 }}>Bubble size represents percentage of token supply held</p>
          <div style={{ marginTop: 10, fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: 'rgba(255, 0, 0, 0.6)', marginRight: 5 }}></span>
              <span style={{ color: '#ff0000' }}>Majority Holder (&gt;50%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: 'rgba(255, 140, 0, 0.6)', marginRight: 5 }}></span>
              <span style={{ color: '#ff8c00' }}>Major Holder (&gt;25%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: 'rgba(255, 215, 0, 0.6)', marginRight: 5 }}></span>
              <span style={{ color: '#ffd700' }}>Significant Holder (&gt;10%)</span>
            </div>
          </div>
        </div>
        
        {holders.length === 0 ? (
          <div style={{ color: muted, fontSize: 22, textAlign: 'center' }}>No holders found or no data to display.</div>
        ) : (
          <div style={{ width: dimensions.width - 300, height: dimensions.height, position: "relative", zIndex: 1 }}>
            <Graph
              graph={prepareGraphData()}
              options={options}
              events={events}
              getNetwork={network => {
                // Store network instance if needed for later manipulations
              }}
            />
          </div>
        )}
      </div>

      {/* Side Panel with Wallet List */}
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          right: 0,
          width: '300px',
          height: '100vh',
          backgroundColor: cardBg,
          boxShadow: '-5px 0 15px rgba(0,0,0,0.2)',
          color: textColor,
          overflowY: 'auto',
          padding: '20px',
          zIndex: 10
        }}
      >
        <h3 style={{ 
          color: accent, 
          fontSize: 20, 
          fontWeight: 600, 
          marginBottom: 15,
          borderBottom: `1px solid ${muted}`,
          paddingBottom: 10 
        }}>
          Top Token Holders
        </h3>
        
        {getSortedHolders().map((holder, index) => {
          const { color } = getPercentageTierInfo(holder.percentageOfSupplyHeld);
          return (
            <div 
              key={holder.ownerAddress}
              style={{ 
                padding: '10px',
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor: selected && selected.ownerAddress === holder.ownerAddress 
                  ? 'rgba(244, 114, 182, 0.15)' 
                  : holder.percentageOfSupplyHeld > 10
                    ? `rgba(${color.replace('#', '').match(/../g).map(x => parseInt(x, 16)).join(', ')}, 0.1)`
                    : 'rgba(30, 41, 59, 0.5)',
                cursor: 'pointer',
                borderLeft: selected && selected.ownerAddress === holder.ownerAddress 
                  ? `3px solid ${accent}`
                  : `3px solid ${holder.percentageOfSupplyHeld > 10 ? color : 'transparent'}`,
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleListItemClick(holder)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  #{holder.rank} {holder.ownerName || shortenAddress(holder.ownerAddress)}
                </div>
                <div style={{ 
                  color: color, 
                  fontWeight: 600 
                }}>
                  {holder.percentageOfSupplyHeld.toFixed(2)}%
                </div>
              </div>
              <div style={{ fontSize: 13, color: muted, marginTop: 4 }}>
                {formatCurrency(parseFloat(holder.valueUsd))}
              </div>
              <div style={{ fontSize: 11, color: muted, marginTop: 2, opacity: 0.8 }}>
                {holder.ownerAddress}
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && selected && (
        <div style={{ 
          position: 'absolute', 
          bottom: 40, 
          left: 40, 
          backgroundColor: cardBg, 
          padding: 20, 
          borderRadius: 12, 
          color: textColor,
          maxWidth: 350,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          border: `1px solid ${getPercentageTierInfo(selected.percentageOfSupplyHeld).color}`,
          animation: 'floatIn 0.3s ease-out',
          zIndex: 20
        }}>
          <h3 style={{ 
            marginTop: 0, 
            color: getPercentageTierInfo(selected.percentageOfSupplyHeld).color,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{selected.ownerName || `Wallet #${selected.rank}`}</span>
            {selected.percentageOfSupplyHeld > 10 && (
              <span style={{ 
                fontSize: 12, 
                backgroundColor: `rgba(${getPercentageTierInfo(selected.percentageOfSupplyHeld).color.replace('#', '').match(/../g).map(x => parseInt(x, 16)).join(', ')}, 0.1)`, 
                padding: '3px 6px',
                borderRadius: 4
              }}>
                {getPercentageTierInfo(selected.percentageOfSupplyHeld).label}
              </span>
            )}
          </h3>
          <div style={{ marginBottom: 10 }}>
            <div style={{ color: muted, fontSize: 14 }}>Wallet Address</div>
            <div style={{ wordBreak: 'break-all', fontSize: 13 }}>{selected.ownerAddress}</div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ color: muted, fontSize: 14 }}>Value</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{formatCurrency(parseFloat(selected.valueUsd))}</div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ color: muted, fontSize: 14 }}>Percentage of Supply</div>
            <div style={{ 
              fontSize: 18, 
              fontWeight: 600,
              color: getPercentageTierInfo(selected.percentageOfSupplyHeld).color
            }}>
              {selected.percentageOfSupplyHeld.toFixed(2)}%
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ color: muted, fontSize: 14 }}>Rank</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>#{selected.rank}</div>
          </div>
          <button 
            onClick={closeModal} 
            style={{ 
              backgroundColor: 'transparent', 
              border: `1px solid ${getPercentageTierInfo(selected.percentageOfSupplyHeld).color}`,
              color: getPercentageTierInfo(selected.percentageOfSupplyHeld).color,
              padding: '6px 12px',
              borderRadius: 6,
              cursor: 'pointer',
              marginTop: 10,
              fontSize: 14
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
