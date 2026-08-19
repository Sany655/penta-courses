import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import './TerminalLab.css';

const TerminalLab = () => {
  const [history, setHistory] = useState([
    { type: 'system', content: 'PentaOS v2.4.1 (tty1) - Advanced Network Emulator' },
    { type: 'system', content: 'Type `help` to see available commands.' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const processCommand = (cmd) => {
    const args = cmd.split(' ').filter(Boolean);
    const mainCommand = args[0];
    const target = args[1];

    let response = '';

    switch (mainCommand) {
      case 'clear':
        return null; // Special case handled in handleCommand

      case 'help':
        response = `Available commands:\n  ifconfig        Show network interfaces\n  ping [host]     Test reachability\n  traceroute      Trace path to host\n  netstat -an     Show active connections\n  nslookup [host] DNS query\n  nmap [host]     Port scanner\n  clear           Clear terminal`;
        break;

      case 'ifconfig':
      case 'ip':
        response = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.105  netmask 255.255.255.0  broadcast 192.168.1.255\n        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>\n        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)\n        RX packets 42131  bytes 51239841 (51.2 MB)\n        TX packets 12390  bytes 2309481 (2.3 MB)\n\nlo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n        inet 127.0.0.1  netmask 255.0.0.0`;
        break;

      case 'ping':
        if (!target) return 'Usage: ping [destination]';
        response = `PING ${target} ( ${target} ) 56(84) bytes of data.\n64 bytes from ${target}: icmp_seq=1 ttl=115 time=12.4 ms\n64 bytes from ${target}: icmp_seq=2 ttl=115 time=13.1 ms\n64 bytes from ${target}: icmp_seq=3 ttl=115 time=12.8 ms\n\n--- ${target} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss`;
        break;

      case 'traceroute':
      case 'tracert':
        if (!target) return 'Usage: traceroute [destination]';
        response = `traceroute to ${target}, 30 hops max, 60 byte packets\n 1  router.local (192.168.1.1)  1.234 ms\n 2  isp-gw (10.10.0.1)  14.567 ms\n 3  core-router-lon (172.16.5.2)  22.102 ms\n 4  ${target}  25.432 ms`;
        break;

      case 'netstat':
        if (args[1] === '-an') {
          response = `Active Internet connections (servers and established)\nProto Recv-Q Send-Q Local Address           Foreign Address         State\ntcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN\ntcp        0      0 192.168.1.105:443       10.0.2.15:53210         ESTABLISHED\nudp        0      0 0.0.0.0:68              0.0.0.0:*`;
        } else {
          response = `Usage: netstat -an`;
        }
        break;

      case 'nslookup':
        if (!target) return 'Usage: nslookup [domain]';
        response = `Server:		8.8.8.8\nAddress:	8.8.8.8#53\n\nNon-authoritative answer:\nName:	${target}\nAddress: 142.250.190.46\nAddress: 2607:f8b0:4009:80f::200e`;
        break;

      case 'nmap':
        if (!target) return 'Usage: nmap [target]';
        response = `Starting Nmap 7.92 ( https://nmap.org ) at 2026-08-18\nNmap scan report for ${target}\nHost is up (0.015s latency).\nNot shown: 997 closed tcp ports (conn-refused)\nPORT    STATE SERVICE\n22/tcp  open  ssh\n80/tcp  open  http\n443/tcp open  https\n\nNmap done: 1 IP address (1 host up) scanned in 1.42 seconds`;
        break;

      case 'sudo':
        response = `pentauser is not in the sudoers file. This incident will be reported.`;
        break;

      default:
        response = `bash: ${mainCommand}: command not found`;
        break;
    }

    return response;
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter' && !isProcessing) {
      const cmd = input.trim();
      if (!cmd) return;
      
      const newHistory = [...history, { type: 'input', content: cmd }];
      setInput('');
      setIsProcessing(true);

      // Simulate command processing delay
      setTimeout(() => {
        const mainCommand = cmd.split(' ')[0];
        if (mainCommand === 'clear') {
          setHistory([]);
        } else {
          const response = processCommand(cmd);
          setHistory([...newHistory, { type: 'output', content: response }]);
        }
        setIsProcessing(false);
      }, Math.random() * 600 + 200); // Random delay between 200ms and 800ms

      setHistory(newHistory);
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="mac-btns">
          <span className="mac-btn close"></span>
          <span className="mac-btn min"></span>
          <span className="mac-btn max"></span>
        </div>
        <div className="terminal-title">
          <TerminalIcon size={14} /> root@pentabrid-lab:~
        </div>
      </div>
      
      <div className="terminal-body" onClick={() => document.getElementById('term-input').focus()}>
        {history.map((item, idx) => (
          <div key={idx} className={`log-line ${item.type}`}>
            {item.type === 'input' && <span className="prompt">root@pentabrid-lab:~# </span>}
            <span className="content">{item.content}</span>
          </div>
        ))}
        <div className="input-line">
          <span className="prompt">root@pentabrid-lab:~# </span>
          <input 
            id="term-input"
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            autoFocus
            spellCheck="false"
            disabled={isProcessing}
          />
        </div>
        {isProcessing && <div className="processing-cursor">_</div>}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default TerminalLab;
