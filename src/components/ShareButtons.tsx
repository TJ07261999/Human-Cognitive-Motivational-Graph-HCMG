import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

const PLATFORMS = [
  { name: 'X', bg: 'hover:bg-black', text: 'hover:text-white', isUrl: true },
  { name: 'Instagram', bg: 'hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500', text: 'hover:text-white', isUrl: false },
  { name: 'TikTok', bg: 'hover:bg-black', text: 'hover:text-white', isUrl: false },
  { name: 'Facebook', bg: 'hover:bg-blue-600', text: 'hover:text-white', isUrl: true },
  { name: 'LINE', bg: 'hover:bg-[#06C755]', text: 'hover:text-white', isUrl: true },
  { name: 'Threads', bg: 'hover:bg-black', text: 'hover:text-white', isUrl: true },
  { name: 'WhatsApp', bg: 'hover:bg-[#25D366]', text: 'hover:text-white', isUrl: true },
  { name: 'KakaoTalk', bg: 'hover:bg-[#FEE500]', text: 'hover:text-black', isUrl: false },
  { name: 'Reddit', bg: 'hover:bg-[#FF4500]', text: 'hover:text-white', isUrl: true },
  { name: 'Discord', bg: 'hover:bg-[#5865F2]', text: 'hover:text-white', isUrl: false },
  { name: 'BeReal', bg: 'hover:bg-black', text: 'hover:text-white', isUrl: false },
  { name: 'setlog', bg: 'hover:bg-indigo-500', text: 'hover:text-white', isUrl: false },
];

export default function ShareButtons({ title = "HCMG - Human Cognitive Motivational Graph", url = window.location.href }: { title?: string, url?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (platformName: string) => {
    const text = encodeURIComponent(`Check out ${title}!`);
    const link = encodeURIComponent(url);
    
    // アプリのURIスキームまたはフォールバックのウェブURL
    let shareUrl = '';
    let needsCopyFallback = false;

    switch (platformName) {
      case 'X':
        shareUrl = `https://twitter.com/intent/tweet?url=${link}&text=${text}`; // アプリが入っていればアプリが開く
        break;
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${link}`;
        break;
      case 'LINE':
        shareUrl = `https://line.me/R/msg/text/?${text}%20${link}`;
        break;
      case 'WhatsApp':
        shareUrl = `whatsapp://send?text=${text}%20${link}`;
        break;
      case 'Reddit':
        shareUrl = `https://www.reddit.com/submit?url=${link}&title=${text}`;
        break;
      case 'Threads':
        shareUrl = `https://threads.net/intent/post?text=${text}%20${link}`;
        break;
      case 'Instagram':
        needsCopyFallback = true;
        shareUrl = 'instagram://';
        break;
      case 'TikTok':
        needsCopyFallback = true;
        shareUrl = 'snssdk1233://'; // 共通のTikTokスキーム
        break;
      case 'KakaoTalk':
        shareUrl = `kakaotalk://send?text=${text}%20${link}`;
        break;
      case 'Discord':
        needsCopyFallback = true;
        shareUrl = 'discord://';
        break;
      case 'BeReal':
        needsCopyFallback = true;
        shareUrl = 'bereal://';
        break;
      case 'setlog':
        needsCopyFallback = true;
        shareUrl = 'setlog://';
        break;
      default:
        needsCopyFallback = true;
        break;
    }

    // 引数渡しをサポートしていないアプリ等はクリップボードにコピーした上でアプリを開く準備をする
    if (needsCopyFallback) {
      try {
        await navigator.clipboard.writeText(`${title} - ${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (e) {
        console.error('Failed to copy', e);
      }
    }

    if (shareUrl) {
      // intentを安全に開く (モバイルブラウザやSafariでのディープリンクに対応)
      const newWin = window.open(shareUrl, '_blank', 'noopener,noreferrer');
      
      // デスクトップなどでwindow.openがブロックされた場合のWebスキームリダイレクトのフォールバック
      if (!newWin && shareUrl.includes('://') && !shareUrl.startsWith('http')) {
        window.location.href = shareUrl;
      }
    }
  };

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 mt-12 mb-8">
      <div className="flex items-center gap-2 mb-4 text-neutral-300 font-medium">
        <Share2 size={18} />
        <span>Share Results</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.name}
            onClick={() => handleShare(p.name)}
            className={`px-4 py-2 text-sm font-medium bg-neutral-800 text-neutral-400 border border-neutral-700/50 rounded-full transition-all duration-200 ${p.bg} ${p.text} hover:scale-105 active:scale-95`}
          >
            {p.name}
          </button>
        ))}
      </div>
      {copied && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 py-2 px-4 rounded-full">
          <Check size={16} /> Link Copied to Clipboard!
        </div>
      )}
    </div>
  );
}
