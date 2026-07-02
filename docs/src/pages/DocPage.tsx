import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

type Section = {
  id: string
  title: string
  body?: string[]
  bullets?: string[]
  cards?: Array<{ title: string; body: string; color: string; rgb: string }>
}

export type Doc = {
  path: string
  eyebrow: string
  title: string
  lede: string
  sections: Section[]
  next?: Array<{ to: string; label: string; desc: string }>
}

const blue = { color: '#dbeafe', rgb: '219, 234, 254' }
const dark = { color: '#94a3b8', rgb: '148, 163, 184' }

export const docs: Doc[] = [
  {
    path: '/',
    eyebrow: 'Documentation',
    title: 'NeuroMind',
    lede: 'A user guide for reading Polymarket edges, unlocking reports, and judging research estimates.',
    sections: [
      {
        id: 'what-it-is',
        title: 'What NeuroMind does',
        body: [
          'NeuroMind helps you find Polymarket markets where the displayed odds may be wrong. It compares market prices against research probability estimates, then highlights the largest divergences as potential edges.',
          'NeuroMind does not place bets for you. It gives you research, sources, resolution-risk notes, and direct Polymarket links so you can make your own decision.',
        ],
      },
      {
        id: 'main-surfaces',
        title: 'Main surfaces',
        cards: [
          { title: 'Edge Board', body: 'Browse public market rankings by odds, research estimate, edge size, confidence, volume, and rule risk.', ...blue },
          { title: 'Reports', body: 'Unlock the full reasoning behind one market, including key drivers, sources, and settlement wording risks.', ...dark },
          { title: 'Track Record', body: 'Review resolved calls with wins, losses, hit rate, simulated PnL, and calibration context.', ...blue },
          { title: 'Account', body: 'Check free dives, holder daily access, credits, payment status, and usage history.', ...dark },
        ],
      },
      {
        id: 'how-to-use-it',
        title: 'How to use it',
        bullets: [
          'Open the Edge Board and sort by edge points to see the strongest divergences first.',
          'Check confidence and resolution risk before deciding whether the edge is worth deeper research.',
          'Unlock a report only when the preview and market setup are relevant to you.',
          'Use the Polymarket link inside the report if you want to trade directly on Polymarket.',
          'Review the Track Record regularly so you know how research estimates have performed after resolution.',
        ],
      },
    ],
    next: [
      { to: '/edge-board', label: 'Edge Board', desc: 'How to read the market ranking table.' },
      { to: '/reports', label: 'Reports', desc: 'What you get when you unlock a report.' },
      { to: '/access-model', label: 'Access Model', desc: 'Free tries, holder dailies, and paid credits.' },
    ],
  },
  {
    path: '/getting-started',
    eyebrow: 'Guide',
    title: 'Getting Started',
    lede: 'The fastest path from first visit to reading your first unlocked report.',
    sections: [
      {
        id: 'first-visit',
        title: 'First visit',
        body: [
          'You can browse the Edge Board and Track Record without connecting a wallet. This lets you inspect live market rankings, see example previews, and judge whether the product is useful before unlocking anything.',
          'A wallet is only needed when you want to unlock full report reasoning, use free dives, use holder access, or buy credits.',
        ],
      },
      {
        id: 'connect-wallet',
        title: 'Connect a Solana wallet',
        body: [
          'Use the Login button in the app header. NeuroMind supports Solana wallets only. Your wallet is used for login, quota ownership, holder checks, and SOL credit payments.',
          'NeuroMind does not ask for private keys and does not place trades from your wallet.',
        ],
      },
      {
        id: 'first-report',
        title: 'Unlock your first report',
        bullets: [
          'Choose a market from the Edge Board.',
          'Read the public preview, odds, research estimate, confidence, and resolution risk.',
          'Open the report page and unlock it with an available free dive, holder daily, or credit.',
          'Read the reasoning and sources, then decide independently whether to act on Polymarket.',
        ],
      },
    ],
  },
  {
    path: '/access-model',
    eyebrow: 'Access',
    title: 'Access Model',
    lede: 'The board is free to browse. Full report reasoning is the paid or quota-gated resource.',
    sections: [
      {
        id: 'what-is-free',
        title: 'What is free',
        body: [
          'Anyone can view the Edge Board, market questions, public odds, research estimates, edge points, confidence, resolution risk, volume, freshness, and locked report previews.',
          'The Track Record is also public so users can judge resolved calls without connecting a wallet.',
        ],
      },
      {
        id: 'unlock-options',
        title: 'Unlock options',
        bullets: [
          'First wallet connection: 5 lifetime reports.',
          '10k+ $NEUROMIND holders: 1 additional report per day.',
          'Paid credits: buy report credits with SOL after free access is used.',
        ],
      },
      {
        id: 'quota-priority',
        title: 'Quota priority',
        body: [
          'When you unlock a report, NeuroMind first checks for an available holder daily, then remaining free dives, then paid credits. If none are available, the app shows the payment flow.',
          'Holder daily access resets at 00:00 UTC. Free dives are lifetime per wallet and do not reset.',
        ],
      },
      {
        id: 'locked-previews',
        title: 'Locked previews',
        body: [
          'Locked reports show enough context to decide whether the market is interesting, but the full reasoning, source list, and detailed resolution-risk notes remain unavailable until unlock.',
          'This keeps the paid report valuable while still letting users compare markets before spending a quota unit.',
        ],
      },
    ],
  },
  {
    path: '/edge-board',
    eyebrow: 'Product',
    title: 'Edge Board',
    lede: 'The main screen for finding markets where NeuroMind disagrees with Polymarket odds.',
    sections: [
      {
        id: 'what-you-see',
        title: 'What you see',
        body: [
          'Each row represents a scanned Polymarket market with a report available or ready to unlock. The YES/NO bar shows market odds in a Polymarket-style format, while the research marker shows the independent estimate.',
          'The most important number is edge points: the absolute gap between market probability and research probability. Bigger edge points mean stronger disagreement, not guaranteed profit.',
        ],
      },
      {
        id: 'columns',
        title: 'Key fields',
        bullets: [
          'Market odds: what Polymarket is currently implying.',
          'research estimate: NeuroMind probability estimate for the same outcome.',
          'Edge points: the difference between market odds and research estimate.',
          'Confidence: how strongly NeuroMind trusts the estimate.',
          'Resolution risk: how likely wording or settlement rules can create a non-obvious outcome.',
          'Volume: how much activity exists around the market.',
          'Freshness: when the market was last scanned.',
        ],
      },
      {
        id: 'how-to-filter',
        title: 'How to filter',
        body: [
          'Use filters to narrow the board to your style: categories you understand, minimum volume, confidence levels, resolution windows, or direction. Direction means whether NeuroMind is more bullish YES or more bullish NO than the market.',
          'A high edge with high resolution risk should be treated differently from a high edge with low resolution risk. The board exposes both so you do not over-focus on the headline edge number.',
        ],
      },
      {
        id: 'search',
        title: 'Market search',
        body: [
          'You can search by market text or paste a Polymarket URL. If a recent report exists, NeuroMind takes you to it. If not, the app can start a new report from the board flow.',
        ],
      },
    ],
  },
  {
    path: '/reports',
    eyebrow: 'Product',
    title: 'Reports',
    lede: 'A report is the full research view for one market.',
    sections: [
      {
        id: 'report-header',
        title: 'Report header',
        body: [
          'The top of a report shows the market question, Polymarket link, market odds, research estimate, edge points, confidence, volume, and resolution-risk score.',
          'Use this section to decide whether the report is saying YES is underpriced, NO is underpriced, or the market is too risky to trust despite the probability gap.',
        ],
      },
      {
        id: 'reasoning',
        title: 'Reasoning',
        body: [
          'The reasoning section explains why NeuroMind disagrees with the market. It should identify the key drivers, what the market may be missing, what assumptions matter most, and which developments could change the estimate.',
          'A good report is not just a number. It should make the probability estimate legible enough that you can disagree with it intelligently.',
        ],
      },
      {
        id: 'sources',
        title: 'Sources',
        body: [
          'Sources show the public material NeuroMind used to form the report: market rules, official references, relevant data, news, or context pages.',
          'Sources are included so users can verify claims, inspect the original market wording, and avoid blindly trusting a summary.',
        ],
      },
      {
        id: 'resolution-risk',
        title: 'Resolution risk',
        body: [
          'Resolution risk is separate from probability. A market can have a real edge and still be dangerous if the wording is vague, the source of truth is unclear, or the outcome can resolve against the intuitive interpretation.',
          'Read this section before acting on any market with a high risk score. It is designed to surface the kinds of rule traps prediction-market users often miss.',
        ],
      },
    ],
  },
  {
    path: '/track-record',
    eyebrow: 'Performance',
    title: 'Track Record',
    lede: 'The public page for judging resolved NeuroMind calls.',
    sections: [
      {
        id: 'why-it-matters',
        title: 'Why it matters',
        body: [
          'Prediction research should be judged after markets resolve. The Track Record shows wins and losses so users can evaluate whether research estimates are useful over time.',
          'Do not judge the product from one report. Look at resolved calls, confidence buckets, average edge, and calibration across a growing sample.',
        ],
      },
      {
        id: 'headline-stats',
        title: 'Headline stats',
        bullets: [
          'Resolved calls: total reports with known outcomes.',
          'Hit rate: percentage of resolved calls that were directionally correct.',
          'High-confidence hit rate: hit rate on reports marked high confidence.',
          'Simulated PnL: a simple tracking metric for how flagged edges would have performed under the displayed assumptions.',
          'Average edge: the average edge size on winning and losing calls.',
        ],
      },
      {
        id: 'calibration',
        title: 'Calibration',
        body: [
          'Calibration asks whether probabilities behave like probabilities. If NeuroMind says 70% often enough, roughly 70% of comparable calls should resolve correctly over a large sample.',
          'Calibration is more important than sounding confident. A model that is honest about uncertainty is more useful than one that overstates every edge.',
        ],
      },
      {
        id: 'losses',
        title: 'Losses stay visible',
        body: [
          'Misses are part of the record and should not be hidden. A transparent record makes it easier to understand which categories, confidence levels, or market types NeuroMind handles best.',
        ],
      },
    ],
  },
  {
    path: '/account',
    eyebrow: 'Product',
    title: 'Account',
    lede: 'Your wallet-linked view for quota, credits, and usage.',
    sections: [
      {
        id: 'quota-status',
        title: 'Quota status',
        body: [
          'The account page shows free dives left, paid credits, and whether your holder daily is available. This is the first place to check if an unlock fails or asks for payment.',
          'Free dives are tied to the connected wallet. Credits and usage history are also tied to that wallet.',
        ],
      },
      {
        id: 'holder-status',
        title: 'Holder status',
        body: [
          'If your connected wallet holds 10k+ $NEUROMIND, the account page shows holder eligibility and the daily access state. Holder access is checked again when you unlock reports, so the status reflects current wallet ownership.',
        ],
      },
      {
        id: 'usage-history',
        title: 'Usage history',
        body: [
          'Usage history shows which quota source was consumed for prior reports: free trial, holder daily, or paid credit. Use it to track where your access went.',
        ],
      },
      {
        id: 'wallet-safety',
        title: 'Wallet safety',
        body: [
          'NeuroMind uses wallet connection for identity and access. It does not need your private key and does not trade for you. Any market action happens on Polymarket, outside NeuroMind.',
        ],
      },
    ],
  },
  {
    path: '/payments',
    eyebrow: 'Credits',
    title: 'Payments',
    lede: 'Buy report credits with SOL when free access is exhausted.',
    sections: [
      {
        id: 'credit-packs',
        title: 'Credit packs',
        body: [
          'Credit packs are shown on the account page. Choose a pack, generate a payment intent, then send the displayed SOL amount with the displayed memo.',
          'Each credit unlocks one full report. Credits remain tied to the wallet that generated the payment intent.',
        ],
      },
      {
        id: 'memo',
        title: 'Why the memo matters',
        body: [
          'The memo is how NeuroMind matches a payment to your wallet and credit pack. If you send SOL without the correct memo, credit confirmation may fail or require manual support.',
        ],
      },
      {
        id: 'confirmation',
        title: 'Confirmation',
        body: [
          'After payment, the account page should show the credit update once the transaction is confirmed and matched. Keep the transaction signature if you need support.',
        ],
      },
      {
        id: 'no-custody',
        title: 'No product-side custody',
        body: [
          'Credits only unlock NeuroMind research. They do not represent bets, positions, yield, or custody of market funds.',
        ],
      },
    ],
  },
  {
    path: '/methodology',
    eyebrow: 'Research',
    title: 'Methodology',
    lede: 'How to understand research estimates, edge points, confidence, and resolution risk.',
    sections: [
      { id: 'probability-first', title: 'Probability first', body: ['NeuroMind starts with the question: what probability should this market imply if the user reads the rules, evidence, and context carefully?', 'The estimate is then compared against market odds. The difference becomes the edge score. A positive edge does not guarantee the outcome; it means NeuroMind estimates the market price is miscalibrated.'] },
      { id: 'confidence', title: 'Confidence', body: ['Confidence describes how sturdy the estimate is. High confidence means the evidence is cleaner, the market rules are clearer, or the setup has stronger historical/base-rate support.', 'Low confidence does not always mean no edge. It means more can break the estimate, so users should size caution accordingly.'] },
      { id: 'resolution-risk', title: 'Resolution risk', body: ['Resolution risk asks whether the market may settle in a way that surprises casual readers. This includes ambiguous wording, disputed sources, timing edge cases, or definitions that differ from common intuition.', 'NeuroMind exposes this separately because many prediction-market mistakes come from being right about reality but wrong about the market wording.'] },
      { id: 'timestamped-calls', title: 'Timestamped calls', body: ['A report should be read as a snapshot. Market odds can move after the report is created, but the original estimate and context remain the basis for track-record evaluation.'] },
    ],
  },
  {
    path: '/faq',
    eyebrow: 'Help',
    title: 'FAQ',
    lede: 'Common user questions about NeuroMind.',
    sections: [
      { id: 'is-this-financial-advice', title: 'Is this financial advice?', body: ['No. NeuroMind is a research tool. Reports can be wrong, markets are risky, and users are responsible for their own decisions.'] },
      { id: 'does-neuromind-place-bets', title: 'Does NeuroMind place bets?', body: ['No. NeuroMind links to Polymarket. Any trading action happens directly on Polymarket, not inside NeuroMind.'] },
      { id: 'why-connect-wallet', title: 'Why connect a wallet?', body: ['Wallets are used for login, free dives, holder checks, paid credits, and usage history. Browsing public edges and the track record does not require login.'] },
      { id: 'what-if-report-is-wrong', title: 'What if a report is wrong?', body: ['Wrong calls remain part of the track record. The product is meant to be judged by resolved performance across many reports, not by any single prediction.'] },
    ],
  },
  {
    path: '/terms',
    eyebrow: 'Legal',
    title: 'Terms',
    lede: 'Terms for using NeuroMind as a research product.',
    sections: [
      { id: 'research-only', title: 'Research only', body: ['NeuroMind provides research, market summaries, probability estimates, source links, and resolution-risk analysis. It does not execute trades, manage funds, custody assets, or guarantee outcomes.', 'You are responsible for deciding whether to use any information from NeuroMind and for any action you take on third-party platforms.'] },
      { id: 'eligibility', title: 'Eligibility and compliance', body: ['You are responsible for following the laws and rules that apply to you, including rules related to prediction markets, online services, taxes, and wallet usage.', 'If you are not allowed to use Polymarket or similar services in your jurisdiction, NeuroMind does not give you permission to do so.'] },
      { id: 'credits-and-access', title: 'Credits and access', body: ['Credits unlock access to NeuroMind reports. Credits are not investment products, cash balances, betting positions, or claims on future returns.', 'Free dives, holder access, and credits may be limited, adjusted, or revoked in cases of abuse, fraud, technical issues, or attempts to bypass access controls.'] },
      { id: 'third-party-links', title: 'Third-party links', body: ['Reports may link to Polymarket or external sources. NeuroMind is not responsible for third-party websites, market availability, settlement decisions, fees, outages, or policy changes.'] },
      { id: 'no-warranty', title: 'No warranty', body: ['NeuroMind is provided as-is. Reports may contain errors, outdated information, incomplete source coverage, or incorrect estimates. You use the product at your own risk.'] },
    ],
  },
  {
    path: '/privacy',
    eyebrow: 'Legal',
    title: 'Privacy',
    lede: 'What NeuroMind needs to operate wallet-based access.',
    sections: [
      { id: 'wallet-data', title: 'Wallet data', body: ['NeuroMind uses your wallet public address to identify your account, track free dives, check holder eligibility, record credits, and show usage history.', 'A public wallet address is not a private key. NeuroMind never asks for or stores private keys or seed phrases.'] },
      { id: 'usage-data', title: 'Usage data', body: ['NeuroMind may store which reports you unlock, when quota is consumed, payment intents, credit balances, and support-relevant transaction references.', 'This data is used to operate access, prevent quota abuse, troubleshoot payments, and improve the product experience.'] },
      { id: 'payments', title: 'Payments', body: ['SOL payments are public blockchain transactions. NeuroMind uses payment amount, memo, wallet address, and confirmation status to grant credits.', 'Do not send sensitive personal information in payment memos or wallet transaction notes.'] },
      { id: 'third-party-services', title: 'Third-party services', body: ['Wallet connection, blockchain confirmation, analytics, hosting, and linked sources may involve third-party services. Those services may process data under their own policies.'] },
      { id: 'security', title: 'Security', body: ['Keep your wallet secure. NeuroMind cannot recover lost wallets, reverse blockchain transactions, or protect you from malicious browser extensions or phishing pages outside the official app.'] },
    ],
  },
  {
    path: '/disclaimer',
    eyebrow: 'Legal',
    title: 'Disclaimer',
    lede: 'Important limits of NeuroMind research.',
    sections: [
      { id: 'not-advice', title: 'Not financial advice', body: ['NeuroMind reports are informational research outputs. They are not financial, investment, legal, tax, or trading advice.', 'Prediction markets can be volatile, illiquid, confusing, or unavailable. You can lose money even when a report appears well supported.'] },
