/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  Coins, 
  Check, 
  CreditCard, 
  History, 
  X, 
  Sparkles, 
  Scale, 
  AlertTriangle, 
  ShieldCheck, 
  Landmark, 
  Banknote,
  Send,
  UserCheck,
  ShieldAlert,
  Smartphone,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { User, Transaction, CoinPackage, CoinEconomySettings, WithdrawalRequest } from '../types';

interface CoinWalletModalProps {
  currentUser: User;
  transactions: Transaction[];
  onClose: () => void;
  onCoinsPurchased: (amount: number, description: string) => void;
  coinPackages: CoinPackage[];
  economySettings: CoinEconomySettings;
  onWithdrawalRequested: (req: WithdrawalRequest) => void;
}

export default function CoinWalletModal({
  currentUser,
  transactions,
  onClose,
  onCoinsPurchased,
  coinPackages,
  economySettings,
  onWithdrawalRequested,
}: CoinWalletModalProps) {
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'buy' | 'history' | 'cashout'>('buy');
  const [simulatedGateway, setSimulatedGateway] = useState<'none' | 'stripe' | 'easypaisa' | 'jazzcash'>('none');
  const [isProcessing, setIsProcessing] = useState(false);

  // Cash-out Withdrawal Simulator States
  const [kycVerified, setKycVerified] = useState<boolean>(() => {
    return localStorage.getItem(`matchgig_kyc_verified_${currentUser.id}`) === 'true';
  });
  const [kycName, setKycName] = useState('');
  const [kycCnic, setKycCnic] = useState('');
  const [isVerifyingKyc, setIsVerifyingKyc] = useState(false);

  // Withdraw states
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [withdrawChannel, setWithdrawChannel] = useState<'easypaisa' | 'jazzcash' | 'card' | 'bank_transfer'>('easypaisa');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawAccountName, setWithdrawAccountName] = useState('');
  const [withdrawalSuccessSummary, setWithdrawalSuccessSummary] = useState<{
    amount: number;
    channel: string;
    account: string;
    pkr: number;
    fee: number;
    netPayout: number;
  } | null>(null);

  // Calculations for payouts
  const isPremium = currentUser.subscription === 'Pro' || currentUser.subscription === 'VIP';
  const platformFeePercentage = isPremium ? (economySettings?.premiumFee ?? 10) : (economySettings?.standardFee ?? 20);

  const coinsToWithdrawValue = parseFloat(withdrawAmount) || 0;
  const rawPkrAmount = coinsToWithdrawValue * (economySettings?.pkrRate ?? 1); // Exchange Rate
  const feeAmount = (rawPkrAmount * platformFeePercentage) / 100;
  const netEarningsPkr = rawPkrAmount - feeAmount;

  const handlePurchase = (pkgId: string) => {
    setSelectedPkg(pkgId);
    setSimulatedGateway('easypaisa'); // default to local Pakistani gateway
  };

  const executePurchaseSim = (amount: number, bonus: number, label: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      onCoinsPurchased(amount + bonus, `Purchased ${label} pack with ${simulatedGateway.toUpperCase()}`);
      setIsProcessing(false);
      setSimulatedGateway('none');
      setSelectedPkg(null);
    }, 1200);
  };

  const handleVerifyKYCSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!kycName.trim() || !kycCnic.trim()) return;
    setIsVerifyingKyc(true);
    setTimeout(() => {
      setKycVerified(true);
      localStorage.setItem(`matchgig_kyc_verified_${currentUser.id}`, 'true');
      setIsVerifyingKyc(false);
    }, 1500);
  };

  const executeWithdrawalRequest = (e: FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseInt(withdrawAmount);
    if (!cleanAmount || cleanAmount <= 0) {
      alert("برائے مہربانی درست کوائنز کی تعداد درج کریں (Please enter a valid coin value)");
      return;
    }

    if (currentUser.coins < cleanAmount) {
      alert(`ناکافی فنڈز! آپ کے پاس صرف ${currentUser.coins} کوائنز موجود ہیں۔ (Insufficient coins!)`);
      return;
    }

    if (!kycVerified) {
      alert("رقم نکالنے سے پہلے KYC ویریفکیشن مکمل کرنا لازمی ہے۔ (KYC required!)");
      return;
    }

    if (!withdrawAccount.trim() || !withdrawAccountName.trim()) {
      alert("براہ کرم اکاؤنٹ نمبر اور اکاؤنٹ ہولڈر کا نام درج کریں۔ (Fill account info)");
      return;
    }

    const methodLabel = withdrawChannel === 'easypaisa' ? 'Easypaisa' : withdrawChannel === 'jazzcash' ? 'JazzCash' : withdrawChannel === 'bank_transfer' ? 'Bank Transfer' : 'Debit Card';

    const newRequest: WithdrawalRequest = {
      id: 'w_' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      userUsername: currentUser.username,
      amount: cleanAmount,
      method: methodLabel,
      accountNumber: withdrawAccount,
      accountName: withdrawAccountName,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      feeDeducted: feeAmount,
      netPayout: netEarningsPkr
    };

    // Process simulation
    setIsProcessing(true);
    setTimeout(() => {
      // Deduct coins via negative purchase amount (as they are locked in pending state)
      onCoinsPurchased(-cleanAmount, `Withdrew ${cleanAmount} Coins to ${withdrawChannel.toUpperCase()} (${withdrawAccount}) - PENDING APPROVAL`);
      
      // Dispatch request to shared state
      onWithdrawalRequested(newRequest);

      setWithdrawalSuccessSummary({
        amount: cleanAmount,
        channel: withdrawChannel,
        account: withdrawAccount,
        pkr: rawPkrAmount,
        fee: feeAmount,
        netPayout: netEarningsPkr
      });

      setIsProcessing(false);
    }, 1500);
  };

  const selectedPackageDetails = (coinPackages || []).find((p) => p.id === selectedPkg);
  const filteredTx = transactions.filter((t) => t.userId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-850 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="coin-wallet-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-850 bg-neutral-950/40">
          <div className="flex items-center space-x-3 text-left">
            <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
              <Coins className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">MatchGig Coins & Revenue Studio</h3>
              <p className="text-xs text-neutral-400">Buy coins, send real gifts, and cash out earnings via local Pakistani channels.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition"
            id="close-wallet-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance & User status banner */}
        <div className="mx-6 mt-6 p-5 rounded-2xl bg-gradient-to-r from-neutral-950/80 via-neutral-900 to-indigo-950/20 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-500 p-3 rounded-2xl shadow-lg shadow-amber-500/20">
              <Coins className="w-8 h-8 text-neutral-950" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">Available Coin Balance</span>
              <p className="text-3xl font-black text-white">{currentUser.coins.toLocaleString()} <span className="text-xs text-amber-400 uppercase font-mono font-bold">Coins</span></p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold ${
              isPremium ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-neutral-800 text-neutral-400 border border-neutral-700/50'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentUser.subscription} Account Level</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">Withdrawal Fee: {platformFeePercentage}%</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-6 mt-6 border-b border-neutral-850">
          <button
            onClick={() => { setActiveTab('buy'); setWithdrawalSuccessSummary(null); }}
            className={`flex items-center space-x-2 pb-3 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'buy' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Store Packages (خریداری)</span>
          </button>
          <button
            onClick={() => { setActiveTab('cashout'); setWithdrawalSuccessSummary(null); }}
            className={`flex items-center space-x-2 pb-3 ml-6 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'cashout' ? 'border-indigo-400 text-white' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Banknote className="w-4 h-4 text-teal-400" />
            <span>Withdraw Cash (رقم نکالیں)</span>
          </button>
          <button
            onClick={() => { setActiveTab('history'); setWithdrawalSuccessSummary(null); }}
            className={`flex items-center space-x-2 pb-3 ml-6 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'history' ? 'border-amber-500 text-white' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Ledger Logs ({filteredTx.length})</span>
          </button>
        </div>

        {/* Dynamic Sandbox Checkout Modal Overlay within Scrollable viewport */}
        <div className="flex-1 overflow-y-auto p-6" id="wallet-scroll-pane">
          {simulatedGateway !== 'none' ? (
            /* STORE PACKAGES CHECKOUT GATEWAY */
            selectedPackageDetails && (
              <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-2xl max-w-md mx-auto text-left">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#00e676] bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase">🇵🇰 Secured Pakistan Sandbox Terminal</span>
                <h4 className="text-lg font-black text-white mt-3">
                  MatchGig Mobile Express checkout
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">You are purchasing virtual coins with safe local checkout validation checks.</p>

                {/* Gateway Switcher Tabs */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <button
                    onClick={() => setSimulatedGateway('easypaisa')}
                    className={`py-2 px-1 text-[10px] font-bold font-mono rounded-lg border transition-all flex flex-col items-center justify-center ${
                      simulatedGateway === 'easypaisa'
                        ? 'bg-emerald-500/10 border-emerald-500 text-[#00e676]'
                        : 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>❇️ Easypaisa</span>
                  </button>
                  <button
                    onClick={() => setSimulatedGateway('jazzcash')}
                    className={`py-2 px-1 text-[10px] font-bold font-mono rounded-lg border transition-all flex flex-col items-center justify-center ${
                      simulatedGateway === 'jazzcash'
                        ? 'bg-amber-600/10 border-amber-500 text-amber-500'
                        : 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>🔥 JazzCash</span>
                  </button>
                  <button
                    onClick={() => setSimulatedGateway('stripe')}
                    className={`py-2 px-1 text-[10px] font-bold font-mono rounded-lg border transition-all flex flex-col items-center justify-center ${
                      simulatedGateway === 'stripe'
                        ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                        : 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>💳 Card / Stripe</span>
                  </button>
                </div>

                {/* Package Breakdown Box */}
                <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 mb-6 space-y-2">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Store Packages Selected</span>
                    <span className="font-bold text-white font-mono">{selectedPackageDetails.amount} Coins</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Checkout Value</span>
                    <span className="font-bold text-[#00e676] font-mono">{selectedPackageDetails.price} PKR</span>
                  </div>
                  <div className="flex justify-between text-xs text-amber-400 border-b border-neutral-800 pb-2">
                    <span>Bundle Promotional Bonus</span>
                    <span>+{selectedPackageDetails.bonus} Coins (Free)</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-1">
                    <span>Final Amount:</span>
                    <span className="text-[#00e676] font-mono">{selectedPackageDetails.price.toLocaleString()} PKR</span>
                  </div>
                </div>

                {/* Standard Card input mockup or cellular account layout */}
                {simulatedGateway === 'stripe' ? (
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Bank Card details</label>
                    <input
                      type="text"
                      placeholder="Account holder Name Name"
                      defaultValue={currentUser.name}
                      disabled
                      className="w-full text-xs bg-neutral-900 border border-neutral-800 p-2.5 rounded-lg text-neutral-300 pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="💳 4242 4242 4242 (Dev Sandbox Mode)"
                      disabled
                      className="w-full text-xs bg-neutral-900 border border-neutral-800 p-2.5 rounded-lg text-neutral-400 font-mono"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">
                      Pakistani Account Number (فون نمبر)
                    </label>
                    <input
                      type="text"
                      placeholder="🇵🇰 e.g. 0321 4567890"
                      defaultValue="0321-4567890"
                      className="w-full text-xs bg-neutral-900 border border-neutral-800 p-2.5 rounded-lg text-neutral-200 outline-none focus:border-amber-500 font-mono"
                    />
                    <span className="text-[9px] text-neutral-500 italic block">Simulated OTP and wallet approval popup will trigger immediately upon payout.</span>
                  </div>
                )}

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setSimulatedGateway('none')}
                    className="flex-1 py-2.5 text-xs font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={() =>
                      executePurchaseSim(
                        selectedPackageDetails.amount,
                        selectedPackageDetails.bonus,
                        `${selectedPackageDetails.amount} Coins`
                      )
                    }
                    className="flex-1 py-2.5 text-xs font-mono font-bold bg-[#00e676] hover:bg-[#00c853] text-neutral-950 rounded-xl transition flex items-center justify-center space-x-1"
                  >
                    {isProcessing ? (
                      <span className="animate-pulse">Authorizing...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-neutral-950 font-black" />
                        <span>Confirm Purchase</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          ) : (
            /* MAIN MODAL TABS VIEW CONTROLLER */
            <>
              {activeTab === 'buy' && (
                <div className="text-left space-y-6">
                  <div className="bg-neutral-950 p-4 border border-neutral-800 rounded-2xl flex items-center space-x-3">
                    <span className="text-2xl">💰</span>
                    <p className="text-xs text-neutral-400 leading-relaxed md:max-w-md">
                      Buy official coins in Pakistani Rupees. Purchased coin values can be transferred directly to other creators by selecting virtual gifts inside live consultation rooms or direct chats.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(coinPackages || []).filter(p => p.isActive).map((pkg) => (
                      <div
                        key={pkg.id}
                        className="group bg-neutral-950/40 hover:bg-neutral-950 border border-neutral-850 hover:border-amber-500/40 p-5 rounded-2xl transition-all relative overflow-hidden flex flex-col justify-between text-left"
                      >
                        {pkg.bonus > 0 && (
                          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-600 to-yellow-500 text-neutral-950 text-[10px] font-extrabold px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                            +{pkg.bonus} Bonus!
                          </div>
                        )}
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Coins className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                            <span className="text-lg font-black text-white">{pkg.amount} Coins</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mb-4 leading-normal">
                            Secure instant local refill. Bonus coins are available for immediate distribution.
                          </p>
                        </div>
                        <button
                          onClick={() => handlePurchase(pkg.id)}
                          className="w-full mt-2 py-2.5 px-4 bg-neutral-900 border border-neutral-800 group-hover:bg-amber-500 text-neutral-300 group-hover:text-neutral-950 text-xs font-mono font-extrabold rounded-xl transition-all flex items-center justify-center space-x-1"
                        >
                          <span>Buy for {pkg.price.toLocaleString()} {pkg.currency || 'PKR'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'cashout' && (
                <div className="text-left space-y-6">
                  
                  {withdrawalSuccessSummary ? (
                    /* SUCCESS SCREEN DISPLAY */
                    <div className="bg-gradient-to-br from-neutral-950 to-teal-950/20 p-6 rounded-3xl border border-teal-500/30 text-center space-y-4 animate-fadeIn">
                      <div className="w-12 h-12 bg-teal-500/10 border border-teal-400/20 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-black text-teal-400">رقم نکلوانے کی درخواست کامیاب!</h4>
                      <h5 className="text-sm font-bold text-white uppercase tracking-wider">Withdrawal Request Transmitted!</h5>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                        Your cash-out request is successfully queued in the MatchGig settlement protocol ledger. Funds will be cleared in 1-2 hours upon verification.
                      </p>

                      <div className="max-w-md mx-auto bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-2 text-xs font-mono text-left">
                        <div className="flex justify-between border-b border-neutral-850 pb-2">
                          <span className="text-neutral-400">Withdrawn coins:</span>
                          <span className="text-white font-bold">{withdrawalSuccessSummary.amount} Coins</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Exchange Rate:</span>
                          <span className="text-neutral-300">1 Coin = 1 PKR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Premium Revenue Level:</span>
                          <span className={`font-bold ${isPremium ? 'text-indigo-400' : 'text-neutral-400'}`}>
                            {currentUser.subscription} Mode ({100 - platformFeePercentage}% share)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Platform tax ({platformFeePercentage}%):</span>
                          <span className="text-red-400">-{withdrawalSuccessSummary.fee} PKR</span>
                        </div>
                        <div className="flex justify-between border-t border-neutral-850 pt-2 text-sm font-bold">
                          <span className="text-[#00e676]">Net PKR Deposited:</span>
                          <span className="text-[#00e676]">{withdrawalSuccessSummary.netPayout.toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-neutral-850 text-[11px] text-neutral-500">
                          <span>Target Channel:</span>
                          <span className="uppercase font-bold text-white">{withdrawalSuccessSummary.channel}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-neutral-500">
                          <span>Beneficiary Account:</span>
                          <span className="font-bold text-white">{withdrawalSuccessSummary.account}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setWithdrawalSuccessSummary(null)}
                        className="px-6 py-2 bg-neutral-800 hover:bg-neutral-750 text-white font-mono text-xs font-bold rounded-xl transition"
                      >
                        Return to Payout Panel
                      </button>
                    </div>
                  ) : (
                    /* ACTIVE CASHOUT CALCULATOR & KYC FORM */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Left: Withdrawal controls */}
                      <div className="md:col-span-7 space-y-4">
                        
                        {/* KYC block validation check */}
                        {!kycVerified ? (
                          <div className="bg-[#b38f00]/10 border border-yellow-500/30 p-5 rounded-2xl flex flex-col space-y-3.5">
                            <div className="flex items-start space-x-3">
                              <ShieldAlert className="w-5 h-5 text-yellow-500 grow-0 mt-0.5" />
                              <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">سیکیورٹی نوٹس: فیس و شناختی کارڈ کی تصدیق</h4>
                                <h4 className="text-[11px] font-extrabold text-yellow-500 uppercase tracking-widest font-mono">KYC Verification REQUIRED</h4>
                                <p className="text-[11px] text-neutral-300 leading-relaxed mt-1">
                                  Anti-Fraud Rules enforce that every creator must complete identity validation checks before requesting withdrawal clearances.
                                </p>
                              </div>
                            </div>

                            <form onSubmit={handleVerifyKYCSubmit} className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 space-y-2.5">
                              <div>
                                <label className="text-[9px] font-mono text-neutral-500 block">Full Name matching CNIC:</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Ali Ahmed"
                                  value={kycName}
                                  onChange={(e) => setKycName(e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2 rounded-lg outline-none focus:border-amber-500"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-mono text-neutral-500 block font-mono">Pakistani CNIC Number (شناختی کارڈ نمبر):</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. 35202-XXXXXXX-X"
                                  value={kycCnic}
                                  onChange={(e) => setKycCnic(e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2 rounded-lg outline-none focus:border-amber-500 font-mono"
                                />
                              </div>
                              <button
                                type="submit"
                                disabled={isVerifyingKyc}
                                className="w-full py-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-750 text-neutral-950 font-mono text-[10px] font-black uppercase rounded-lg transition"
                              >
                                {isVerifyingKyc ? 'Verifying CNIC database...' : 'Submit Verification Selfie & CNIC'}
                              </button>
                            </form>
                          </div>
                        ) : (
                          <div className="bg-emerald-500/5 border border-emerald-500/25 p-4 rounded-2xl flex items-center space-x-3">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                            <div>
                              <span className="text-[9px] font-mono tracking-wider text-emerald-400 font-black block uppercase">✓ Verified Identity Tier</span>
                              <h4 className="text-xs font-bold text-white">KYC Verification Completed Successfully</h4>
                              <p className="text-[10px] text-neutral-500 font-mono">CNIC Clearance Token active on current profile.</p>
                            </div>
                          </div>
                        )}

                        {/* Withdrawal parameter form */}
                        <form onSubmit={executeWithdrawalRequest} className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-4">
                          <span className="text-[10px] font-mono text-indigo-400 font-black uppercase tracking-wider block">Initiate Withdrawal Request</span>
                          
                          {/* Transfer gateway provider blocks */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-neutral-500 block uppercase">Withdrawal Settlement Provider:</label>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { key: 'easypaisa', label: '❇️ Easypaisa' },
                                { key: 'jazzcash', label: '🔥 JazzCash' },
                                { key: 'bank_transfer', label: '🏦 Bank Transfer' },
                                { key: 'card', label: '💳 debit Card' }
                              ].map((item) => (
                                <button
                                  type="button"
                                  key={item.key}
                                  onClick={() => setWithdrawChannel(item.key as any)}
                                  className={`p-2 rounded-lg border text-xs font-mono font-bold text-left transition-all ${
                                    withdrawChannel === item.key 
                                      ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                                      : 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white'
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-mono text-neutral-500 block uppercase">Amount of Coins to cash-out:</label>
                              <div className="relative mt-1">
                                <input
                                  type="number"
                                  min="100"
                                  required
                                  value={withdrawAmount}
                                  onChange={(e) => setWithdrawAmount(e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 pr-8 rounded-xl font-mono focus:outline-none focus:border-indigo-500"
                                />
                                <span className="absolute right-3 top-2.5 text-neutral-500 font-mono text-xs">🪙</span>
                              </div>
                              <span className="text-[9px] text-neutral-500 font-mono mt-1 block">Min limit: 100 Coins</span>
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-neutral-500 block uppercase">Account / Mobile Number:</label>
                              <input
                                type="text"
                                required
                                placeholder={withdrawChannel === 'easypaisa' || withdrawChannel === 'jazzcash' ? '03XX-XXXXXXX' : 'IBAN / Card Number'}
                                value={withdrawAccount}
                                onChange={(e) => setWithdrawAccount(e.target.value)}
                                className="w-full mt-1 bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl font-mono focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-neutral-500 block uppercase">Beneficiary Full Name (اکاؤنٹ ہولڈر کا نام):</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Naveed Iqbal"
                              value={withdrawAccountName}
                              onChange={(e) => setWithdrawAccountName(e.target.value)}
                              className="w-full mt-1 bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-indigo-500 animate-fadeIn"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 text-neutral-950 font-mono text-xs font-extrabold uppercase rounded-xl transition flex items-center justify-center space-x-1.5 shadow-lg shadow-teal-500/10 ${
                              !kycVerified ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                          >
                            <span>Clear Settlement / Request Cash Out</span>
                            <Send className="w-4 h-4 text-neutral-950" />
                          </button>
                        </form>

                      </div>

                      {/* Right Side: Split Calculator & Pakistan Rules List */}
                      <div className="md:col-span-5 space-y-4">
                        
                        {/* Dynamic split result bracket */}
                        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl relative overflow-hidden">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-rose-400 bg-rose-500/15 border border-rose-500/10 px-2 py-0.5 rounded-md uppercase">Real-Time Revenue Split</span>
                          <h4 className="text-xs font-black text-white uppercase tracking-wider mt-4">Calculated Profit Calculator</h4>
                          
                          <div className="mt-4 space-y-2.5 text-xs font-mono">
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Coins input:</span>
                              <span className="text-white font-bold">{coinsToWithdrawValue.toLocaleString()} Coins</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-neutral-850">
                              <span className="text-neutral-400">Equivalent Value:</span>
                              <span className="text-white">Rs. {rawPkrAmount.toLocaleString()} PKR</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Platform tax ({platformFeePercentage}%):</span>
                              <span className="text-red-400">Rs. {feeAmount.toLocaleString()} PKR</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-neutral-850 text-sm font-black">
                              <span className="text-[#00e676]">Your Net Payout:</span>
                              <span className="text-[#00e676]">Rs. {netEarningsPkr.toLocaleString()} PKR</span>
                            </div>
                          </div>

                          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-850 mt-4 text-[11px] text-neutral-400 leading-normal">
                            💰 <span className="font-bold text-white">Rule #4 Premium advantage</span>: Pro or VIP level accounts enjoy a reduced platform fee block of <span className="text-indigo-400 font-bold">10%</span> instead of standard <span className="text-neutral-400 font-bold">20%</span>.
                          </div>
                        </div>

                        {/* Anti fraud core checkpoints */}
                        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-3">
                          <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1">
                            <ShieldAlert className="w-4 h-4 text-rose-500" />
                            <span>Anti-Fraud Sentinel System (سیکیورٹی ضوابط)</span>
                          </h4>
                          
                          <ul className="text-[10px] text-neutral-400 font-sans space-y-2.5">
                            <li className="flex items-start space-x-2">
                              <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                              <span><strong>Anti-Self Gifting</strong>: Senders cannot transfer coins to themselves or alternative accounts on the same IP mask. (سیلف گفٹنگ ممنوع ہے)</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                              <span><strong>Daily Limits</strong>: Newly registered profiles are capped at sending 1,000 Coins daily.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                              <span><strong>Manual Escrow Reviews</strong>: Transactions exceeding 2,000 coins are held in manual oversight for 2 hours automatically.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                              <span><strong>Device Guard</strong>: Hardware device fingerprint locks are active. Only 1 unique profile is authorized per device.</span>
                            </li>
                          </ul>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-3 text-left">
                  <div className="bg-neutral-950 p-4 border border-neutral-800 rounded-2xl flex items-center space-x-3 mb-2">
                    <History className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Coin Wallet Settlement Ledgers</h4>
                      <p className="text-[11px] text-neutral-400 leading-normal">
                        Every action, including package checkout purchases, gift transactions, and cash withdrawals are logged dynamically.
                      </p>
                    </div>
                  </div>

                  {filteredTx.length === 0 ? (
                    <div className="text-center py-10 text-neutral-500 text-xs font-mono font-semibold">
                      0 TRANSACTION logs found under current freelancer profile.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {filteredTx.map((tx) => (
                        <div
                          key={tx.id}
                          className="bg-neutral-950 p-4 rounded-xl flex items-center justify-between border border-neutral-850/60"
                        >
                          <div>
                            <p className="text-xs font-bold text-white">{tx.description}</p>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              {new Date(tx.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div
                            className={`text-xs font-bold font-mono ${
                              tx.amount > 0 ? 'text-emerald-400' : 'text-amber-500'
                            }`}
                          >
                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Coins
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
