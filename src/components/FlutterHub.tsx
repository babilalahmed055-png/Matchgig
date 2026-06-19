/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Smartphone,
  Database,
  Coins,
  Gift,
  Code2,
  Download,
  Copy,
  Check,
  Layers,
  Terminal,
  ArrowRight,
  Lock,
  Server,
  Globe,
  Sparkles,
  Smartphone as DeviceIcon,
  Play,
  RotateCcw
} from 'lucide-react';
import { User, Transaction, SubscriptionType } from '../types';

interface FlutterHubProps {
  currentUser: User;
  onCoinsReward: (amount: number, description: string) => void;
}

export default function FlutterHub({ currentUser, onCoinsReward }: FlutterHubProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'simulator' | 'source_code' | 'db_schema' | 'api_endpoints'>('simulator');
  const [selectedFile, setSelectedFile] = useState<'main.dart' | 'api_client.dart' | 'coin_wallet.dart' | 'gifting_engine.dart' | 'subscription_manager.dart' | 'admin_dashboard.dart'>('main.dart');
  const [copied, setCopied] = useState(false);

  // Mobile App Simulator State
  const [simulatorScreen, setSimulatorScreen] = useState<'home' | 'wallet' | 'gifts' | 'subscription'>('home');
  const [simCoins, setSimCoins] = useState(currentUser.coins);
  const [simSubscription, setSimSubscription] = useState<SubscriptionType>(currentUser.subscription);
  const [simLogs, setSimLogs] = useState<string[]>([
    'Flutter engine initialized successfully. (Dart VM v3.2)',
    'MatchGig secure sqlite persistent storage connected.',
    'WebSocket real-time channel established to: wss://api.matchgig.com/live-escrow'
  ]);
  const [sentGifts, setSentGifts] = useState<{ name: string; quantity: number }[]>([]);
  const [showGiftParticle, setShowGiftParticle] = useState<string | null>(null);

  const handleTriggerSimLog = (log: string) => {
    setSimLogs((prev) => [log, ...prev].slice(0, 10));
  };

  const handleSimBuyCoins = (amount: number) => {
    setSimCoins((prev) => prev + amount);
    onCoinsReward(amount, `Refilled via Mobile Flutter Simulator Sandbox`);
    handleTriggerSimLog(`[CoinsWallet] Transaction confirmed. Deposited +${amount} coins. New Balance: ${simCoins + amount}`);
  };

  const handleSimSendGift = (giftName: string, cost: number, icon: string) => {
    if (simCoins < cost) {
      handleTriggerSimLog(`[GiftingEngine] FAILED: Insufficient balance to purchase virtual ${giftName} (${cost} Coins).`);
      return;
    }
    setSimCoins((prev) => prev - cost);
    // Add/Update gift count
    setSentGifts((prev) => {
      const existing = prev.find((g) => g.name === giftName);
      if (existing) {
        return prev.map((g) => (g.name === giftName ? { ...g, quantity: g.quantity + 1 } : g));
      }
      return [...prev, { name: giftName, quantity: 1 }];
    });
    setShowGiftParticle(icon);
    setTimeout(() => setShowGiftParticle(null), 1500);
    handleTriggerSimLog(`[GiftingEngine] Broadcasted ${icon} ${giftName} successfully. -${cost} coins held & transferred to Creator channel escrow.`);
  };

  const handleSimUpgradeSub = (tier: SubscriptionType, cost: number) => {
    if (simCoins < cost) {
      handleTriggerSimLog(`[Subscription] FAILED: Insufficient funds to upgrade to ${tier} subscription (${cost} Coins).`);
      return;
    }
    setSimCoins((prev) => prev - cost);
    setSimSubscription(tier);
    handleTriggerSimLog(`[Subscription] Status changed: Activated ${tier} Subscription tier until 2027! -${cost} coins.`);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // FLUTTER DART SOURCE CODE TEXTS
  const dartCodeMap = {
    'main.dart': `// Flutter MatchGig MVP Entrypoint
// File Path: lib/main.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/api_client.dart';
import 'screens/marketplace_dashboard.dart';
import 'screens/coin_wallet.dart';
import 'screens/subscription_manager.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        Provider<MatchGigApiClient>(create: (_) => MatchGigApiClient(baseUrl: 'https://api.matchgig.com')),
        ChangeNotifierProvider<WalletState>(create: (_) => WalletState()),
      ],
      child: const MatchGigApp(),
    ),
  );
}

class MatchGigApp extends StatelessWidget {
  const MatchGigApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MatchGig MVP Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0A0A0A),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF9333EA), // Purple-650 style
          secondary: Color(0xFFF59E0B), // Amber-500 coin color
          background: Color(0xFF0D0D0D),
          surface: Color(0xFF171717),
        ),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const MarketplaceDashboard(),
        '/wallet': (context) => const CoinWalletScreen(),
        '/subscription': (context) => const SubscriptionScreen(),
      },
    );
  }
}

class WalletState extends ChangeNotifier {
  int _coins = 1250;
  int get coins => _coins;

  void addCoins(int count) {
    _coins += count;
    notifyListeners();
  }

  bool spendCoins(int count) {
    if (_coins >= count) {
      _coins -= count;
      notifyListeners();
      return true;
    }
    return false;
  }
}`,

    'api_client.dart': `// Secure API integration client with Dio & WebSockets support
// File Path: lib/services/api_client.dart

import 'dart:convert';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'package:web_socket_channel/web_socket_channel.dart';

class MatchGigApiClient {
  final String baseUrl;
  final String? jwtToken;

  MatchGigApiClient({required this.baseUrl, this.jwtToken});

  // REST API: Get Marketplace Gigs
  Future<List<dynamic>> fetchGigs() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/v1/gigs'),
      headers: {
        'Content-Type': 'application/json',
        if (jwtToken != null) 'Authorization': 'Bearer $jwtToken',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['gigs'];
    } else {
      throw Exception('Failed to load MatchGig marketplace items');
    }
  }

  // REST API: Trigger Virtual Escrow contract
  Future<Map<String, dynamic>> initiateEscrow(String gigId, int amount) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/v1/wallet/escrow'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'gigId': gigId,
        'escrowAmount': amount,
      }),
    );
    return jsonDecode(response.body);
  }

  // Live real-time stream subscription for virtual gifts & notifications
  Stream<dynamic> listenToGiftsChannel(String creatorRoomId) {
    final channel = WebSocketChannel.connect(
      Uri.parse('wss://api.matchgig.com/ws/live-gifts?room=$creatorRoomId'),
    );
    return channel.stream.map((data) => jsonDecode(data));
  }
}`,

    'coin_wallet.dart': `// Coins Wallet system with Interactive Refills & Ledger list
// File Path: lib/screens/coin_wallet.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../main.dart';

class CoinWalletScreen extends StatelessWidget {
  const CoinWalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final wallet = Provider.of<WalletState>(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Coin Ledger & Systems', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [Colors.purple[950]!, Colors.black]),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.amber[500]!.withOpacity(0.3)),
              ),
              child: Column(
                children: [
                  const Text('AVALIABLE BALANCE', style: TextStyle(fontSize: 12, letterSpacing: 1.5, color: Colors.grey)),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.monetization_on, color: Colors.amber[500], size: 36),
                      const SizedBox(width: 8),
                      Text('\${wallet.coins}', style: const TextStyle(fontSize: 40, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () => wallet.addCoins(500),
                  child: const Text('Add 500 Coins'),
                ),
                ElevatedButton(
                  onPressed: () => wallet.spendCoins(200),
                  child: const Text('Spend 200 Coins'),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}`,

    'gifting_engine.dart': `// Interactive Realtime Gifting particle and overlay emitter
// File Path: lib/widgets/gifting_engine.dart

import 'dart:math';
import 'package:flutter/material.dart';

class GiftParticleOverlay extends StatefulWidget {
  final String giftIcon;
  const GiftParticleOverlay({super.key, required this.giftIcon});

  @override
  State<GiftParticleOverlay> createState() => _GiftParticleOverlayState();
}

class _GiftParticleOverlayState extends State<GiftParticleOverlay> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<Point> _particles = [];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 2))
      ..addListener(() => setState(() {}))
      ..forward();
    
    // Generate scattered points
    final rand = Random();
    for (int i = 0; i < 15; i++) {
      _particles.add(Point(rand.nextDouble() * 300, rand.nextDouble() * 500));
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: IgnorePointer(
        child: Stack(
          children: _particles.map((p) {
            final t = _controller.value;
            return Positioned(
              left: p.x,
              bottom: p.y + (t * 200), // float upwards
              child: Opacity(
                opacity: 1.0 - t,
                child: Transform.scale(
                  scale: 0.5 + (t * 1.5),
                  child: Text(widget.giftIcon, style: const TextStyle(fontSize: 32)),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}

class Point {
  final double x;
  final double y;
  Point(this.x, this.y);
}`,

    'subscription_manager.dart': `// Tier Upgrade manager for Free, Pro, and VIP Memberships
// File Path: lib/screens/subscription_manager.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../main.dart';

class SubscriptionScreen extends StatelessWidget {
  const SubscriptionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final wallet = Provider.of<WalletState>(context);
    
    return Scaffold(
      body: Center(
        child: Card(
          elevation: 12,
          color: const Color(0xFF151515),
          child: Container(
            width: 320,
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('VIP SUBSCRIPTION', style: TextStyle(fontSize: 18, fontWeight: FontWeight.black, color: Color(0xFF9333EA))),
                const SizedBox(height: 12),
                const Text('• Verified Badge\\n• 0% Escrow Surcharge\\n• Dynamic Audits & Tools', style: TextStyle(color: Colors.grey)),
                const SizedBox(height: 24),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF9333EA)),
                  onPressed: () {
                    if (wallet.spendCoins(750)) {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Successfully upgraded to VIP!')));
                    }
                  },
                  child: const Text('Upgrade with 750 Coins'),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}`,

    'admin_dashboard.dart': `// Freelance administration dashboard console mockup in Flutter
// File Path: lib/screens/admin_dashboard.dart

import 'package:flutter/material.dart';

class AdminDashboard extends StatelessWidget {
  const AdminDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('MatchGig Admin Central')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildMetricCard('Total Escrow in Vault', '854,200 Coins', Colors.amber),
          _buildMetricCard('Dispute Rate', '0.45%', Colors.green),
          _buildMetricCard('Active Broadcasters', '34 Live Now', Colors.purple),
        ],
      ),
    );
  }

  Widget _buildMetricCard(String title, String val, Color col) {
    return Card(
      child: ListTile(
        leading: Icon(Icons.dashboard_customize, color: col),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        trailing: Text(val, style: const TextStyle(color: Colors.white, fontSize: 16)),
      ),
    );
  }
}`
  };

  return (
    <div className="space-y-8" id="flutter-developer-suite">
      {/* Banner segment with dynamic statistics */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-neutral-950 p-6 md:p-8 rounded-3xl border border-neutral-800 text-left relative overflow-hidden">
        <div className="absolute inset-x-0 -top-40 h-80 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full"></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 uppercase tracking-widest">
              Developer & Mobile Suite
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-3 tracking-tight">
              Interactive Flutter Mobile App Architecture
            </h2>
            <p className="text-neutral-400 text-xs mt-2 max-w-xl leading-relaxed">
              Generate, test, and inspect the mobile app codebase for the MatchGig Escrow ecosystem. 
              The suite features a visual live simulator, robust PostgreSQL schemas, custom REST API layouts, and production-ready clean Dart state modules.
            </p>
          </div>
          <button
            onClick={() => {
              // trigger a download click for zip mockup
              const element = document.createElement("a");
              const file = new Blob([JSON.stringify(dartCodeMap, null, 2)], {type: 'text/plain'});
              element.href = URL.createObjectURL(file);
              element.download = "matchgig_flutter_mvp_suite.txt";
              document.body.appendChild(element);
              element.click();
              handleTriggerSimLog("[FlutterHub] Complete codebase exported as matchgig_flutter_mvp_suite.txt successfully!");
            }}
            className="self-start sm:self-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono uppercase tracking-wider text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Dart Suite</span>
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-neutral-800/80 mt-8 gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`pb-2 px-4 text-xs font-mono font-extrabold uppercase tracking-wider transition whitespace-nowrap ${
              activeTab === 'simulator' ? 'border-b-2 border-indigo-500 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            📱 Mobile App Live Simulator
          </button>
          <button
            onClick={() => setActiveTab('source_code')}
            className={`pb-2 px-4 text-xs font-mono font-extrabold uppercase tracking-wider transition whitespace-nowrap ${
              activeTab === 'source_code' ? 'border-b-2 border-indigo-500 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 inline mr-1" /> Flutter Dart MVC Code
          </button>
          <button
            onClick={() => setActiveTab('db_schema')}
            className={`pb-2 px-4 text-xs font-mono font-extrabold uppercase tracking-wider transition whitespace-nowrap ${
              activeTab === 'db_schema' ? 'border-b-2 border-indigo-500 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5 inline mr-1" /> Schema & Relational Models
          </button>
          <button
            onClick={() => setActiveTab('api_endpoints')}
            className={`pb-2 px-4 text-xs font-mono font-extrabold uppercase tracking-wider transition whitespace-nowrap ${
              activeTab === 'api_endpoints' ? 'border-b-2 border-indigo-500 text-white' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 inline mr-1" /> Core API Engine & WS Structure
          </button>
        </div>
      </div>

      {/* Main Viewport Content Splitter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INTERACTIVE SIMULATOR VIEW (TAB: SIMULATOR) */}
        {activeTab === 'simulator' && (
          <>
            {/* Left side: Rendered Dynamic Phone Frame */}
            <div className="col-span-1 lg:col-span-6 flex flex-col items-center">
              <div className="relative w-[310px] h-[610px] bg-neutral-950 rounded-[40px] border-[8px] border-neutral-800 shadow-2xl p-2 flex flex-col justify-between overflow-hidden ring-4 ring-purple-600/10">
                {/* Speaker pill notch */}
                <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-28 h-5 bg-neutral-800 rounded-full z-40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black/40 mr-1.5"></div>
                  <div className="w-12 h-1 bg-black/40 rounded-full"></div>
                </div>

                {/* Simulated Floating Gift Emitters */}
                {showGiftParticle && (
                  <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-end pb-28">
                    <div className="text-5xl animate-bounce filter drop-shadow-lg duration-1000">
                      {showGiftParticle}
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold bg-neutral-900 border border-neutral-800 rounded px-2 py-0.5 mt-2 animate-pulse">
                      Simulated Gift Transfer Casted!
                    </span>
                  </div>
                )}

                {/* Inner Device Screen body */}
                <div className="flex-1 bg-[#101010] rounded-[32px] pt-6 pb-2 px-3 flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Internal header toolbar */}
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-white/50 font-bold font-mono">13:42</span>
                    </div>
                    {/* Simulated Connection Info */}
                    <span className="text-[9px] text-purple-400 font-mono tracking-widest bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/20">
                      MATCHGIG APP RUNNING
                    </span>
                    <div className="flex items-center space-x-1 text-white/50 text-[10px]">
                      <span>⚡</span>
                      <span>📶</span>
                    </div>
                  </div>

                  {/* Main Screen content routers */}
                  <div className="flex-1 py-4 overflow-y-auto space-y-4 text-left scrollbar-none">
                    
                    {/* HOME PORTFOLIO MARKET SCREEN */}
                    {simulatorScreen === 'home' && (
                      <div className="space-y-3.5 animate-fadeIn">
                        <div className="flex justify-between items-center bg-purple-950/10 border border-purple-500/10 p-2.5 rounded-xl">
                          <div>
                            <span className="text-[9px] text-amber-400 font-mono uppercase block">Active Account</span>
                            <span className="text-xs font-bold text-white uppercase">{currentUser.name}</span>
                          </div>
                          <span className="text-xs bg-amber-500/15 text-amber-400 px-2 py-1 rounded font-mono font-black">
                            {simCoins} 🪙
                          </span>
                        </div>

                        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                          Recommended Gigs (Escrow Protection)
                        </div>

                        {/* Gig cards list */}
                        <div className="space-y-2.5">
                          {[
                            { id: '1', title: 'High-Conversion UI Mockups', creator: 'Fatima Malik', price: 350 },
                            { id: '2', title: 'Python Backend REST APIs', creator: 'Zia Khan', price: 500 },
                            { id: '3', title: 'Pro Video Trailer Color Grading', creator: 'Bilal Malik', price: 200 }
                          ].map((g) => (
                            <div key={g.id} className="bg-neutral-900 border border-neutral-850 p-3 rounded-xl flex justify-between items-center hover:border-purple-500/30 transition">
                              <div>
                                <span className="text-xs font-bold text-white block leading-tight">{g.title}</span>
                                <span className="text-[10px] text-neutral-400">By {g.creator}</span>
                              </div>
                              <button
                                onClick={() => {
                                  if (simCoins < g.price) {
                                    handleTriggerSimLog(`[Escrow] FAILED: Insufficient funds (${simCoins} Coins) to book '${g.title}' for ${g.price} Coins.`);
                                  } else {
                                    setSimCoins(prev => prev - g.price);
                                    handleTriggerSimLog(`[Escrow] Initialized order. Contract funds of ${g.price} Coins deposited inside Escrow balance safely.`);
                                  }
                                }}
                                className="bg-purple-600 hover:bg-purple-500 text-[10px] font-mono px-2.5 py-1 text-white rounded-lg transition"
                              >
                                {g.price} 🪙
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* COINS WALLET SCREEN */}
                    {simulatorScreen === 'wallet' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="text-center p-4 bg-gradient-to-tr from-amber-950/20 via-[#141414] to-neutral-950 rounded-2xl border border-amber-500/20">
                          <span className="text-[10px] font-mono text-neutral-500 tracking-wider block uppercase">Escrow Secure Wallet Balance</span>
                          <span className="text-3xl font-black text-white mt-1 block tracking-tight">
                            {simCoins} <span className="text-xs text-amber-400 font-bold">Coins</span>
                          </span>
                        </div>

                        <div className="text-[10px] font-mono uppercase font-bold text-neutral-500 tracking-wider block">
                          Instant Coin Replenishment
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: 'Starter Sack', count: 100 },
                            { label: 'Pro Ledger', count: 500 },
                            { label: 'VIP Vault', count: 2000 }
                          ].map((refill) => (
                            <button
                              key={refill.count}
                              onClick={() => handleSimBuyCoins(refill.count)}
                              className="bg-neutral-900 border border-neutral-850 p-2.5 rounded-xl text-center hover:border-amber-500/30 transition flex flex-col items-center justify-center"
                            >
                              <span className="text-[10px] font-bold text-neutral-400">{refill.label}</span>
                              <span className="text-xs font-mono font-extrabold text-amber-400 mt-1">+{refill.count} 🪙</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* VIRTUAL GIFTS ENGINE SCREEN */}
                    {simulatorScreen === 'gifts' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="bg-neutral-900 border border-neutral-850 p-3 rounded-xl">
                          <span className="text-[9px] text-purple-400 font-mono tracking-widest block uppercase">Selected Creator Streaming Room</span>
                          <span className="text-xs font-bold text-white block">Fatima Malik (UI/UX Live Show)</span>
                          <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                            Gifts are converted to real creator revenue value instantly on transmission.
                          </p>
                        </div>

                        <div className="text-[10px] font-mono uppercase font-bold text-neutral-500 tracking-wider block">
                          Live Gifting Engine Palette
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { name: 'Red Rose', cost: 10, icon: '🌹' },
                            { name: 'Gold Trophy', cost: 50, icon: '🏆' },
                            { name: 'Unicorn Cap', cost: 200, icon: '🦄' },
                            { name: 'Royal Crown', cost: 500, icon: '👑' }
                          ].map((gift) => (
                            <button
                              key={gift.name}
                              onClick={() => handleSimSendGift(gift.name, gift.cost, gift.icon)}
                              className="bg-neutral-900 border border-neutral-850 p-2 rounded-xl hover:border-purple-500/40 transition flex flex-col items-center"
                            >
                              <span className="text-xl mt-1">{gift.icon}</span>
                              <span className="text-[10px] text-white font-bold mt-1.5 truncate max-w-full">{gift.name}</span>
                              <span className="text-[9px] text-amber-500 font-mono font-bold mt-0.5">{gift.cost} 🪙</span>
                            </button>
                          ))}
                        </div>

                        {/* Render previously sent session summaries */}
                        {sentGifts.length > 0 && (
                          <div className="p-2.5 bg-[#141414] rounded-xl border border-neutral-850 text-[11px] space-y-1">
                            <span className="text-[9px] text-neutral-500 font-mono tracking-wider block uppercase">Sent to Creator this Session:</span>
                            {sentGifts.map((g, idx) => (
                              <div key={idx} className="flex justify-between text-neutral-300">
                                <span>{g.name}</span>
                                <span className="font-mono text-purple-400 font-bold">x{g.quantity}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* SUBSCRIPTION TIER CONTROL SCREEN */}
                    {simulatorScreen === 'subscription' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="bg-neutral-900 border border-neutral-850 p-3.5 rounded-2xl flex items-center space-x-2.5">
                          <span className="text-2xl">👑</span>
                          <div>
                            <span className="text-[9px] text-neutral-500 font-mono tracking-wide block uppercase">Current Tier</span>
                            <span className="text-xs font-bold text-white uppercase">{simSubscription} Subscription</span>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="bg-neutral-900 border border-neutral-850/80 p-3 rounded-xl flex justify-between items-center">
                            <div>
                              <span className="text-xs font-bold text-white block">Upgrade to PRO Tier</span>
                              <span className="text-[10px] text-neutral-400">Custom user audit priority</span>
                            </div>
                            <button
                              onClick={() => handleSimUpgradeSub('Pro', 350)}
                              className={`px-2.5 py-1 text-[10px] font-mono rounded font-bold transition ${
                                simSubscription === 'Pro' || simSubscription === 'VIP'
                                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                  : 'bg-indigo-600 text-white'
                              }`}
                              disabled={simSubscription === 'Pro' || simSubscription === 'VIP'}
                            >
                              350 🪙
                            </button>
                          </div>

                          <div className="bg-neutral-900 border-2 border-purple-500/30 p-3 rounded-xl flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-purple-600 text-[8px] font-mono px-1.5 py-0.5 rounded-bl uppercase font-black text-white">
                              Best Sourcing value
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">Upgrade to VIP Crown</span>
                              <span className="text-[10px] text-neutral-400">0% transaction surcharge fee</span>
                            </div>
                            <button
                              onClick={() => handleSimUpgradeSub('VIP', 750)}
                              className={`px-2.5 py-1 text-[10px] font-mono rounded font-bold transition ${
                                simSubscription === 'VIP'
                                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                  : 'bg-purple-600 text-white'
                              }`}
                              disabled={simSubscription === 'VIP'}
                            >
                              750 🪙
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Device Bottom Tab Bars */}
                  <div className="grid grid-cols-4 gap-1 border-t border-neutral-900 pt-2 text-center">
                    <button
                      onClick={() => setSimulatorScreen('home')}
                      className={`py-1 text-[10px] flex flex-col items-center ${
                        simulatorScreen === 'home' ? 'text-indigo-400' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      <span>🏪</span>
                      <span className="scale-[0.85] uppercase tracking-tighter mt-0.5">Market</span>
                    </button>
                    <button
                      onClick={() => setSimulatorScreen('wallet')}
                      className={`py-1 text-[10px] flex flex-col items-center ${
                        simulatorScreen === 'wallet' ? 'text-indigo-400' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      <span>👛</span>
                      <span className="scale-[0.85] uppercase tracking-tighter mt-0.5">Wallet</span>
                    </button>
                    <button
                      onClick={() => setSimulatorScreen('gifts')}
                      className={`py-1 text-[10px] flex flex-col items-center ${
                        simulatorScreen === 'gifts' ? 'text-indigo-400' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      <span>🎁</span>
                      <span className="scale-[0.85] uppercase tracking-tighter mt-0.5">Gift</span>
                    </button>
                    <button
                      onClick={() => setSimulatorScreen('subscription')}
                      className={`py-1 text-[10px] flex flex-col items-center ${
                        simulatorScreen === 'subscription' ? 'text-indigo-400' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      <span>👑</span>
                      <span className="scale-[0.85] uppercase tracking-tighter mt-0.5">VIP</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Right side: Device Log Console and interactive trigger blocks */}
            <div className="col-span-1 lg:col-span-6 flex flex-col space-y-6">
              
              {/* Flutter VM Control Card */}
              <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl text-left space-y-4">
                <div className="flex items-center space-x-2.5">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">Simulated Mobile Console logs</h3>
                </div>

                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl font-mono text-[11px] text-indigo-300 min-h-[160px] max-h-[220px] overflow-y-auto space-y-1.5 scrollbar-thin">
                  {simLogs.map((log, index) => (
                    <div key={index} className="leading-snug">
                      <span className="text-neutral-600 font-bold select-none">&gt;</span> {log}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[11px] text-neutral-500 font-mono">
                  <span>Emulator API level: Android SDK 34 / iOS 17</span>
                  <button
                    onClick={() => {
                      setSimLogs([
                        'Flutter engine reset complete.',
                        'Re-established local sqlite storage context.'
                      ]);
                      setSimCoins(currentUser.coins);
                      setSimSubscription(currentUser.subscription);
                      setSentGifts([]);
                    }}
                    className="text-amber-500 hover:underline flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Emulator</span>
                  </button>
                </div>
              </div>

              {/* Developer Testing quick control */}
              <div className="bg-neutral-900 border border-neutral-850 p-5 rounded-2xl text-left space-y-4 text-xs">
                <h4 className="font-extrabold text-white uppercase tracking-wider text-xs">
                  Sandbox System Explanations & Instructions
                </h4>
                <p className="text-neutral-400 leading-relaxed">
                  The mobile phone simulator illustrates the complete offline-first architecture written using 
                  Flutter models and structures. Gigs bought inside the sandbox interact with the real matching system logs, ensuring compliance.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                    <span className="font-bold text-white block">Escrow Coin System</span>
                    <span className="text-neutral-500 leading-normal block mt-1">
                      Funds reside in secure system state contract tables until order deliverables are completed.
                    </span>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                    <span className="font-bold text-white block">Gifting Cast Overlay</span>
                    <span className="text-neutral-500 leading-normal block mt-1">
                      Provides instant UI visual particle physics rendered over mobile streams on user donations.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}


        {/* FLUTTER PORTABLE SOURCE CODES VIEW (TAB: SOURCE_CODE) */}
        {activeTab === 'source_code' && (
          <div className="col-span-1 lg:col-span-12 space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4 gap-3">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(dartCodeMap) as Array<keyof typeof dartCodeMap>).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold transition ${
                      selectedFile === fileName
                        ? 'bg-indigo-600/20 border border-indigo-500 text-indigo-300'
                        : 'bg-neutral-900 border border-neutral-850 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {fileName}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleCopyCode(dartCodeMap[selectedFile])}
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono px-3.5 py-1.5 rounded-xl text-neutral-300 hover:text-white transition flex items-center space-x-1.5 self-start"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed max-h-[500px] scrollbar-thin">
                <code>{dartCodeMap[selectedFile]}</code>
              </pre>
            </div>
          </div>
        )}


        {/* RELATIONAL DATABASE SCHEMAS & DOCUMENTATIONS (TAB: DB_SCHEMA) */}
        {activeTab === 'db_schema' && (
          <div className="col-span-1 lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* Relational DDL tables and schemas */}
            <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-white text-base">PostgreSQL Relational Schema</h3>
              </div>
              <p className="text-neutral-400 text-xs">
                Matches structural relationships between ledger coins, transactional gifts, subscriptions and escrow contracts.
              </p>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 max-h-[360px] overflow-y-auto scrollbar-thin">
                <pre className="font-mono text-[11px] text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`-- SQL Database Schema for MatchGig MVP

-- Accounts
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar TEXT,
    role VARCHAR(20) DEFAULT 'Regular', -- 'Regular', 'Freelancer', 'Client', 'Admin'
    subscription VARCHAR(10) DEFAULT 'Free', -- 'Free', 'Pro', 'VIP'
    coins INT DEFAULT 1250 CONSTRAINT coins_non_negative CHECK (coins >= 0),
    rating NUMERIC(3, 2) DEFAULT 0.0,
    completed_jobs INT DEFAULT 0,
    badge VARCHAR(20) DEFAULT 'None'
);

-- Freelance Gigs catalog
CREATE TABLE gigs (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    creator_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    price INT NOT NULL CHECK (price >= 100),
    delivery_time INT NOT NULL, -- Days
    revisions INT DEFAULT 3,
    category VARCHAR(50) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 0.0
);

-- Secure Freelancer Escrow System
CREATE TABLE escrow_orders (
    id VARCHAR(50) PRIMARY KEY,
    gig_id VARCHAR(50) REFERENCES gigs(id),
    buyer_id VARCHAR(50) REFERENCES users(id),
    seller_id VARCHAR(50) REFERENCES users(id),
    price INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP NOT NULL
);

-- ledger transaction records
CREATE TABLE wallet_ledger (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id),
    transaction_type VARCHAR(30) NOT NULL, -- 'spend_gift', 'receive_gift', 'order_pay', 'order_earn'
    amount INT NOT NULL,
    description VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
                </pre>
              </div>
            </div>

            {/* Firestore collection blueprint & matching security rules */}
            <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-extrabold text-white text-base">JSON Firestore NoSQL Blueprint</h3>
              </div>
              <p className="text-neutral-400 text-xs">
                Optimal layout structure for live subcollections, messaging events and instant microservice synchronization.
              </p>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 max-h-[360px] overflow-y-auto scrollbar-thin">
                <pre className="font-mono text-[11px] text-zinc-300 leading-relaxed whitespace-pre-wrap">
{`// Cloud Firestore Schema Collections layout

/users/{userId} -> {
    "username": "usman_pk",
    "name": "Usman Malik",
    "coins": 1400,
    "role": "Freelancer",
    "badge": "Verified",
    "subscription": "VIP"
}

/gigs/{gigId} -> {
    "title": "Design Vector Esports Mascot Logo",
    "price": 1200,
    "category": "Logo Design",
    "creatorId": "usr_pk772"
}

/chatrooms/{roomId}/messages/{messageId} -> {
    "senderId": "usr_buyer",
    "text": "Hello, I sent a Rose virtual gift stream!",
    "type": "gift",
    "giftType": "Red Rose",
    "coinsCount": 10,
    "timestamp": "2026-06-18T13:42:00Z"
}

// SECURITY SECURITY RULES CAPABILITY
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /gigs/{gigId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`}
                </pre>
              </div>
            </div>

          </div>
        )}


        {/* SYSTEM REST API & WEBSOCKET ENGINE SPECIFICATION (TAB: API_ENDPOINTS) */}
        {activeTab === 'api_endpoints' && (
          <div className="col-span-1 lg:col-span-12 space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* REST API Endpoints specifications */}
              <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4">
                <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <span>REST API Endpoint Schemas</span>
                </h3>

                <div className="space-y-3">
                  {[
                    { method: 'POST', path: '/api/v1/auth/login', desc: 'Sms/email passwordless user token lookup' },
                    { method: 'GET', path: '/api/v1/gigs/search', desc: 'Query marketplace gigs filtered by price rating country' },
                    { method: 'POST', path: '/api/v1/wallet/escrow', desc: 'Secure order funds in local escrow ledger (Freezes coin count)' },
                    { method: 'POST', path: '/api/v1/wallet/gifting', desc: 'Instantly debit sender coin ledger, trigger sockets broadcast' },
                    { method: 'PUT', path: '/api/v1/subscriptions/tiers', desc: 'Pro/VIP verification state status modifications' }
                  ].map((api) => (
                    <div key={api.path} className="bg-neutral-950 p-3 rounded-xl border border-neutral-850/80 hover:border-indigo-500/20 transition flex items-start space-x-3 text-xs">
                      <span className={`font-mono font-black px-2 py-0.5 rounded ${
                        api.method === 'GET' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {api.method}
                      </span>
                      <div className="space-y-1">
                        <span className="font-mono text-white block">{api.path}</span>
                        <span className="text-neutral-500 leading-snug">{api.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WebSocket and Realtime Streams */}
              <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4">
                <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
                  <Server className="w-5 h-5 text-purple-400" />
                  <span>WebSocket Real-Time Broadcast Architecture</span>
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Real-time events bypass standard HTTP querying for latency-free messaging chat and virtual rose overlay rendering.
                </p>

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-4 text-xs font-mono">
                  <div>
                    <span className="text-white font-extrabold block">Connection Endpoint:</span>
                    <span className="text-purple-400">wss://api.matchgig.com/ws/live-gifts?room=&#123;roomId&#125;</span>
                  </div>

                  <div className="border-t border-neutral-900 pt-3 space-y-2">
                    <span className="text-neutral-400 block font-bold text-[10px] uppercase tracking-wider">Payload Message Format:</span>
                    <pre className="text-[11px] text-zinc-300 leading-relaxed bg-[#0a0a0a] p-3 rounded-lg border border-neutral-850">
{`{
  "event": "gift_sent",
  "data": {
    "giftName": "Gold Trophy",
    "giftIcon": "🏆",
    "cost": 50,
    "sender": "babil_ak",
    "senderAvatar": "https://images.unsplash.com/photo-1534528741775"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
