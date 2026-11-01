import React from 'react';

interface AppIconProps {
  size?: number;
  className?: string;
  showDownload?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ size = 120, className = '', showDownload = false }) => {
  const downloadSvg = () => {
    const svgElem = document.getElementById('obsAppIconSvg');
    if (!svgElem) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElem);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'obs_khata_register_icon.svg';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className={`relative inline-flex flex-col items-center group ${className}`}>
      <svg
        id="obsAppIconSvg"
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-[110px] shadow-2xl transition-transform duration-300 group-hover:scale-105"
        style={{ filter: 'drop-shadow(0 20px 25px rgba(6, 78, 59, 0.45))' }}
      >
        <defs>
          {/* Background Gradients */}
          <radialGradient id="greenBgGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="45%" stopColor="#0f5132" />
            <stop offset="85%" stopColor="#052e16" />
            <stop offset="100%" stopColor="#021c0d" />
          </radialGradient>

          {/* Stitched Border Stroke */}
          <linearGradient id="stitchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#14532d" stopOpacity="0.9" />
          </linearGradient>

          {/* Glossy Specular Light Overlay */}
          <linearGradient id="topGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Letter 'O' Gradients (Solid White with 3D Depth) */}
          <linearGradient id="oFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="oDepth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Letter 'B' Gradients (Yellow / Gold 3D) */}
          <linearGradient id="bFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#eab308" />
            <stop offset="80%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <linearGradient id="bDepth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Letter 'S' Gradients (Double-layered White & Grey) */}
          <linearGradient id="sFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="sInnerLayer" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* 3D Orange Curved Arc */}
          <linearGradient id="orangeArcGrad" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="80%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          <linearGradient id="orangeArcDepth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9a3412" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>

          {/* Book / Notebook Gradients */}
          <linearGradient id="bookCoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="pageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>

          {/* Printer Gradients */}
          <linearGradient id="printerBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="60%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Drop Shadows */}
          <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000000" floodOpacity="0.55" />
          </filter>
          <filter id="deep3DShadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="2" dy="16" stdDeviation="12" floodColor="#021c0d" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* 1. Main Squircle Body (Rounded Square App Icon) */}
        <rect
          x="8"
          y="8"
          width="496"
          height="496"
          rx="110"
          fill="url(#greenBgGrad)"
        />

        {/* Realistic Leather Texture Pattern Overlay */}
        <rect
          x="8"
          y="8"
          width="496"
          height="496"
          rx="110"
          fill="none"
          stroke="url(#topGlow)"
          strokeWidth="6"
        />

        {/* 2. Realistic Stitched Border along the rounded edges */}
        <rect
          x="28"
          y="28"
          width="456"
          height="456"
          rx="90"
          fill="none"
          stroke="url(#stitchGrad)"
          strokeWidth="3.5"
          strokeDasharray="9 7"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Inner subtle groove */}
        <rect
          x="38"
          y="38"
          width="436"
          height="436"
          rx="82"
          fill="none"
          stroke="#052e16"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* ======================================================== */}
        {/* 3. TOP ICON: OPEN 3D NOTEBOOK / REGISTER DIRECTLY BEHIND "OBS" */}
        {/* ======================================================== */}
        <g id="topOpenBook" filter="url(#softShadow)" transform="translate(146, 75)">
          {/* Book Drop Shadow & Back Cover */}
          <path
            d="M 5 65 Q 110 50 215 65 L 210 135 Q 110 120 10 135 Z"
            fill="#0f172a"
            opacity="0.45"
          />
          {/* Back Cover / Spine Leather */}
          <path
            d="M 0 55 Q 110 40 220 55 L 215 125 Q 110 110 5 125 Z"
            fill="url(#bookCoverGrad)"
          />

          {/* Left Page Group */}
          <path
            d="M 12 55 C 45 46 80 44 110 52 L 108 120 C 78 112 45 114 12 123 Z"
            fill="url(#pageGrad)"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          {/* Left Page Horizontal Ruled Lines */}
          <line x1="26" y1="67" x2="98" y2="64" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />
          <line x1="26" y1="79" x2="98" y2="76" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />
          <line x1="26" y1="91" x2="98" y2="88" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />
          <line x1="26" y1="103" x2="98" y2="100" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />

          {/* Right Page Group */}
          <path
            d="M 110 52 C 140 44 175 46 208 55 L 208 123 C 175 114 142 112 112 120 Z"
            fill="url(#pageGrad)"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          {/* Right Page Horizontal Ruled Lines */}
          <line x1="122" y1="64" x2="194" y2="67" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />
          <line x1="122" y1="76" x2="194" y2="79" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />
          <line x1="122" y1="88" x2="194" y2="91" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />
          <line x1="122" y1="100" x2="194" y2="103" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />

          {/* Book Center Binding / Bookmark Ribbon */}
          <line x1="110" y1="46" x2="110" y2="124" stroke="#ca8a04" strokeWidth="3" />
          <path d="M 108 122 L 112 122 L 113 138 L 110 133 L 107 138 Z" fill="#ef4444" />
        </g>

        {/* ======================================================== */}
        {/* 4. CENTRAL 3D LOGO: "OBS" + 3D ORANGE CURVED ARC */}
        {/* ======================================================== */}
        <g id="obsLogoGroup" filter="url(#deep3DShadow)">
          {/* 3D Extrusion Shadow Block for OBS */}
          <g transform="translate(0, 16)" opacity="0.9">
            {/* O Extrusion Base */}
            <path
              d="M 130 190 C 90 190 65 215 65 260 C 65 305 90 330 130 330 C 170 330 195 305 195 260 C 195 215 170 190 130 190 Z M 130 226 C 148 226 158 238 158 260 C 158 282 148 294 130 294 C 112 294 102 282 102 260 C 102 238 112 226 130 226 Z"
              fill="url(#oDepth)"
            />
            {/* B Extrusion Base */}
            <path
              d="M 215 190 L 290 190 C 315 190 335 200 335 224 C 335 238 325 250 310 256 C 330 262 342 276 342 294 C 342 320 320 330 290 330 L 215 330 Z"
              fill="url(#bDepth)"
            />
            {/* S Extrusion Base */}
            <path
              d="M 445 220 L 415 224 C 412 215 402 208 388 208 C 374 208 365 215 365 225 C 365 236 374 242 396 248 C 426 256 448 268 448 294 C 448 322 422 334 388 334 C 352 334 330 318 326 290 L 358 284 C 362 300 374 308 388 308 C 402 308 412 301 412 292 C 412 281 403 275 380 269 C 352 261 332 250 332 226 C 332 202 355 188 388 188 C 420 188 440 202 445 220 Z"
              fill="url(#sInnerLayer)"
            />
          </g>

          {/* --- Front Layer: 'O' (Solid Glossy White) --- */}
          <path
            d="M 130 180 C 90 180 65 205 65 250 C 65 295 90 320 130 320 C 170 320 195 295 195 250 C 195 205 170 180 130 180 Z M 130 216 C 148 216 158 228 158 250 C 158 272 148 284 130 284 C 112 284 102 272 102 250 C 102 228 112 216 130 216 Z"
            fill="url(#oFront)"
            stroke="#ffffff"
            strokeWidth="2"
          />
          {/* 'O' Specular Curved Highlight */}
          <path
            d="M 85 225 C 92 205 110 195 130 195 C 150 195 168 205 175 225 C 168 213 150 205 130 205 C 110 205 92 213 85 225 Z"
            fill="#ffffff"
            opacity="0.8"
          />

          {/* --- Front Layer: 'B' (Chunky Yellow-Gold with Inner Cutouts) --- */}
          <path
            d="M 215 180 L 290 180 C 315 180 335 190 335 214 C 335 228 325 240 310 246 C 330 252 342 266 342 284 C 342 310 320 320 290 320 L 215 320 Z M 250 204 L 250 236 L 285 236 C 295 236 302 231 302 220 C 302 209 295 204 285 204 Z M 250 264 L 250 296 L 288 296 C 299 296 306 291 306 280 C 306 269 299 264 288 264 Z"
            fill="url(#bFront)"
            stroke="#fef08a"
            strokeWidth="2"
          />
          {/* 'B' Gold Shimmer Highlights */}
          <path
            d="M 220 184 L 285 184 C 305 184 320 190 325 205 C 318 194 300 188 285 188 L 220 188 Z"
            fill="#ffffff"
            opacity="0.65"
          />

          {/* --- Front Layer: 'S' (Double-Layered White & Grey 3D) --- */}
          {/* Grey Base Layer */}
          <path
            d="M 445 212 L 415 216 C 412 207 402 200 388 200 C 374 200 365 207 365 217 C 365 228 374 234 396 240 C 426 248 448 260 448 286 C 448 314 422 326 388 326 C 352 326 330 310 326 282 L 358 276 C 362 292 374 300 388 300 C 402 300 412 293 412 284 C 412 273 403 267 380 261 C 352 253 332 242 332 218 C 332 194 355 180 388 180 C 420 180 440 194 445 212 Z"
            fill="url(#sInnerLayer)"
          />
          {/* White Top Layer */}
          <path
            d="M 445 210 L 415 214 C 412 205 402 198 388 198 C 374 198 365 205 365 215 C 365 226 374 232 396 238 C 426 246 448 258 448 284 C 448 312 422 324 388 324 C 352 324 330 308 326 280 L 358 274 C 362 290 374 298 388 298 C 402 298 412 291 412 282 C 412 271 403 265 380 259 C 352 251 332 240 332 216 C 332 192 355 178 388 178 C 420 178 440 192 445 210 Z"
            fill="url(#sFront)"
            stroke="#ffffff"
            strokeWidth="1.5"
          />

          {/* ======================================================== */}
          {/* 3D ORANGE CURVED ARC (PASSING OVER 'O' AND 'B') */}
          {/* ======================================================== */}
          {/* Arc Extrusion Depth */}
          <path
            d="M 60 216 C 90 148 190 134 298 158 C 304 159 308 167 302 172 C 296 177 288 175 282 173 C 185 152 100 165 72 224 C 68 230 60 228 58 222 Z"
            fill="url(#orangeArcDepth)"
            transform="translate(0, 7)"
          />
          {/* Arc Front Face */}
          <path
            d="M 60 212 C 90 144 190 130 298 154 C 306 156 308 166 302 170 C 296 174 288 172 282 170 C 185 148 100 162 72 220 C 68 226 58 222 58 216 Z"
            fill="url(#orangeArcGrad)"
            stroke="#ffedd5"
            strokeWidth="1.5"
          />
          {/* Arc Gloss Glint */}
          <path
            d="M 85 186 C 130 146 210 140 280 158"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>

        {/* ======================================================== */}
        {/* 5. BOTTOM LEFT ICON: 3D THERMAL RECEIPT PRINTER WITH PAPER */}
        {/* ======================================================== */}
        <g id="bottomThermalPrinter" filter="url(#softShadow)" transform="translate(68, 335)">
          {/* Printer 3D Base Body */}
          <rect x="0" y="32" width="94" height="64" rx="14" fill="url(#printerBody)" stroke="#475569" strokeWidth="2" />
          {/* Top Angled Face */}
          <polygon points="0,38 18,12 76,12 94,38" fill="#475569" />
          <polygon points="4,36 20,15 74,15 90,36" fill="#334155" />

          {/* Paper Exit Slot */}
          <rect x="22" y="24" width="50" height="6" rx="3" fill="#090d16" />

          {/* Power / Status Indicator LEDs */}
          <circle cx="20" cy="52" r="3" fill="#22c55e" />
          <circle cx="30" cy="52" r="3" fill="#3b82f6" />
          <circle cx="75" cy="52" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />

          {/* Thermal Printed Paper Receipt curling upward */}
          <g transform="translate(25, -28)">
            {/* White Paper Sheet */}
            <path
              d="M 2 12 Q 22 2 44 8 L 44 54 Q 22 48 2 54 Z"
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth="1.5"
              filter="url(#softShadow)"
            />
            {/* Zigzag Serrated Cut Edge at top */}
            <path
              d="M 2 12 L 6 9 L 10 12 L 14 9 L 18 12 L 22 9 L 26 12 L 30 9 L 34 12 L 38 9 L 42 12 L 44 8"
              stroke="#cbd5e1"
              strokeWidth="1"
              fill="none"
            />
            {/* Printed Barcode and Receipt Text Lines */}
            <line x1="8" y1="18" x2="38" y2="17" stroke="#1e293b" strokeWidth="2.5" />
            <line x1="8" y1="24" x2="28" y2="23" stroke="#64748b" strokeWidth="1.5" />
            <line x1="8" y1="30" x2="36" y2="29" stroke="#64748b" strokeWidth="1.5" />
            <line x1="8" y1="36" x2="24" y2="35" stroke="#64748b" strokeWidth="1.5" />
            <line x1="8" y1="42" x2="38" y2="41" stroke="#0f172a" strokeWidth="2" strokeDasharray="3 2" />
          </g>
        </g>

        {/* ======================================================== */}
        {/* 6. BOTTOM TEXT (URDU): "کھاتہ رجسٹر" (3D WHITE WITH GOLD SHADOW) */}
        {/* ======================================================== */}
        <g id="bottomUrduText" filter="url(#softShadow)" transform="translate(285, 410)">
          {/* Deep 3D Shadow Layer in Warm Gold */}
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fill="#854d0e"
            fontSize="46"
            fontWeight="bold"
            fontFamily="'Noto Nastaliq Urdu', 'Noto Sans Arabic', system-ui, sans-serif"
            letterSpacing="1"
            opacity="0.9"
          >
            کھاتہ رجسٹر
          </text>
          {/* Mid Extrusion Layer in Golden Orange */}
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fill="#ca8a04"
            fontSize="46"
            fontWeight="bold"
            fontFamily="'Noto Nastaliq Urdu', 'Noto Sans Arabic', system-ui, sans-serif"
            letterSpacing="1"
          >
            کھاتہ رجسٹر
          </text>
          {/* Front Face: Pure Crisp 3D White */}
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="46"
            fontWeight="bold"
            fontFamily="'Noto Nastaliq Urdu', 'Noto Sans Arabic', system-ui, sans-serif"
            letterSpacing="1"
          >
            کھاتہ رجسٹر
          </text>
          {/* Subtle Golden Subtitle Bar */}
          <line x1="-80" y1="18" x2="80" y2="18" stroke="#eab308" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <circle cx="0" cy="18" r="3.5" fill="#fef08a" />
        </g>

        {/* Diagonal Gloss Highlight across whole icon */}
        <path
          d="M 8 110 C 8 50 50 8 110 8 L 402 8 C 300 120 180 260 8 360 Z"
          fill="url(#topGlow)"
          opacity="0.4"
        />
      </svg>

      {/* Optional Download CTA Button */}
      {showDownload && (
        <button
          type="button"
          onClick={downloadSvg}
          className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>آئیکن ڈاؤن لوڈ کریں (SVG)</span>
        </button>
      )}
    </div>
  );
};
