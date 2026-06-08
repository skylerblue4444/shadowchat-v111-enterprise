import React, { useState } from "react";

/**
 * Advanced Security & Compliance Dashboard
 * Real-time threat monitoring and compliance audits
 */

export default function SecurityComplianceDashboard() {
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

  const securityMetrics = {
    overallScore: 98,
    threats: 2,
    vulnerabilities: 0,
    complianceScore: 96,
    lastAudit: "2 hours ago",
  };

  const alerts = [
    {
      id: 1,
      type: "Unusual Activity",
      severity: "Medium",
      description: "Login from new IP address detected",
      timestamp: "15 min ago",
      status: "Investigating",
      action: "Review",
    },
    {
      id: 2,
      type: "Rate Limit",
      severity: "Low",
      description: "API rate limit approached on endpoint /api/trades",
      timestamp: "1 hour ago",
      status: "Resolved",
      action: "Details",
    },
  ];

  const complianceChecks = [
    { name: "KYC Verification", status: "✓ Pass", score: 100 },
    { name: "AML Screening", status: "✓ Pass", score: 100 },
    { name: "Data Encryption", status: "✓ Pass", score: 100 },
    { name: "Access Control", status: "✓ Pass", score: 95 },
    { name: "Audit Logging", status: "✓ Pass", score: 98 },
    { name: "Backup & Recovery", status: "✓ Pass", score: 96 },
  ];

  const securityFeatures = [
    { name: "2FA Authentication", enabled: true, users: "98.5%" },
    { name: "Biometric Login", enabled: true, users: "65.2%" },
    { name: "Hardware Wallet Support", enabled: true, users: "34.8%" },
    { name: "IP Whitelisting", enabled: true, users: "12.3%" },
    { name: "Session Timeout", enabled: true, timeout: "30 min" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🛡️ Security & Compliance Dashboard
        </h1>
        <p className="text-slate-400">Real-time threat monitoring and compliance audits</p>
      </div>

      {/* Security Score */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-2">Security Score</div>
          <div className="text-4xl font-bold text-emerald-400 mb-1">{securityMetrics.overallScore}</div>
          <div className="text-xs text-slate-400">Out of 100</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-2">Active Threats</div>
          <div className="text-4xl font-bold text-red-400">{securityMetrics.threats}</div>
          <div className="text-xs text-slate-400">Investigating</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-2">Vulnerabilities</div>
          <div className="text-4xl font-bold text-green-400">{securityMetrics.vulnerabilities}</div>
          <div className="text-xs text-slate-400">Critical</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-2">Compliance Score</div>
          <div className="text-4xl font-bold text-cyan-400">{securityMetrics.complianceScore}</div>
          <div className="text-xs text-slate-400">Out of 100</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-2">Last Audit</div>
          <div className="text-lg font-bold">{securityMetrics.lastAudit}</div>
          <div className="text-xs text-slate-400">Automated</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="col-span-2">
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Security Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedAlert === alert.id
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold">{alert.type}</h3>
                    <p className="text-sm text-slate-400 mt-1">{alert.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-bold ${
                    alert.severity === "High" ? "bg-red-500/20 text-red-400" :
                    alert.severity === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>
                    {alert.severity}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{alert.timestamp}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.status === "Resolved" ? "bg-green-400" : "bg-yellow-400"
                    }`}></div>
                    <span>{alert.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Checks */}
        <div className="col-span-1">
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Compliance Checks</h2>
          <div className="space-y-2">
            {complianceChecks.map((check) => (
              <div key={check.name} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-semibold">{check.name}</div>
                  <div className="text-xs text-green-400 font-bold">{check.status}</div>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${check.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="mt-12">
        <h2 className="text-lg font-bold mb-4 text-emerald-400">Active Security Features</h2>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 bg-slate-900/50 border-b border-slate-700 font-semibold text-sm">
            <div>Feature</div>
            <div>Status</div>
            <div>Adoption</div>
            <div>Details</div>
            <div>Action</div>
          </div>
          {securityFeatures.map((feature) => (
            <div key={feature.name} className="grid grid-cols-5 gap-4 p-4 border-b border-slate-700/50 text-sm items-center">
              <div className="font-semibold">{feature.name}</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-green-400">Enabled</span>
              </div>
              <div className="text-cyan-400 font-semibold">
                {feature.enabled ? (feature.users || feature.timeout) : "N/A"}
              </div>
              <div className="text-slate-400 text-xs">Configured</div>
              <button className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold">Settings</button>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log */}
      <div className="mt-12">
        <h2 className="text-lg font-bold mb-4 text-emerald-400">Recent Audit Events</h2>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span>Automated Security Scan</span>
              <span className="text-green-400">✓ Passed</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span>Compliance Audit</span>
              <span className="text-green-400">✓ Passed</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700/50">
              <span>Penetration Test</span>
              <span className="text-green-400">✓ Passed</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Data Backup Verification</span>
              <span className="text-green-400">✓ Passed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
