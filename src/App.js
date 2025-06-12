import React, { useState, useEffect, useMemo } from 'react';
import { SlidersHorizontal, Box, Type, Copy, Check } from 'lucide-react';

// 辅助函数：将 HEX 颜色和透明度转换为 RGBA 格式
const hexToRgba = (hex, opacity) => {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        return `rgba(0,0,0, ${opacity})`;
    }
    let c = hex.substring(1).split('');
    if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    const r = (c >> 16) & 255;
    const g = (c >> 8) & 255;
    const b = c & 255;
    return `rgba(${r},${g},${b},${opacity})`;
};

// 自定义带输入框的滑块组件
const ControlSliderInput = ({ label, value, onChange, min = 0, max = 100, unit = '%' }) => {
    const handleValueChange = (e) => {
        let numValue = parseInt(e.target.value, 10);
        if (isNaN(numValue)) {
            onChange(e.target.value);
            return;
        }
        onChange(numValue);
    };

    const handleBlur = (e) => {
        let numValue = parseInt(e.target.value, 10);
        if (isNaN(numValue) || numValue < min) {
            numValue = min;
        } else if (numValue > max) {
            numValue = max;
        }
        onChange(numValue);
    };

    return (
        <div className="space-y-2">
            <label className="flex justify-between items-center text-sm font-medium text-gray-300">
                <span>{label}</span>
                <div className="flex items-center bg-gray-900 rounded border border-gray-600 focus-within:ring-2 focus-within:ring-cyan-500 transition-all">
                     <input
                        type="number"
                        value={value}
                        onChange={handleValueChange}
                        onBlur={handleBlur}
                        className="w-20 bg-transparent text-cyan-400 font-mono text-right focus:outline-none p-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-gray-400 pr-2 select-none">{unit}</span>
                </div>
            </label>
            <input
                type="range"
                min={min}
                max={max}
                value={isNaN(parseInt(value)) ? min : parseInt(value)}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
        </div>
    );
};


// 主应用组件
const App = () => {
    // 状态管理
    const [shadowType, setShadowType] = useState('box'); // 'box' 或 'text'
    const [isCopied, setIsCopied] = useState(false);
    const [settings, setSettings] = useState({
        angle: 135,
        distance: 25,
        spread: 0,
        size: 50,
        opacity: 50,
        color: '#000000',
        inset: false,
    });

    // 实时计算 CSS 阴影值
    const generatedCss = useMemo(() => {
        const angleRad = settings.angle * (Math.PI / 180);
        const offsetX = Math.round(settings.distance * Math.cos(angleRad));
        const offsetY = Math.round(settings.distance * Math.sin(angleRad));
        const rgbaColor = hexToRgba(settings.color, settings.opacity / 100);

        if (shadowType === 'box') {
            const spreadRadius = Math.round(settings.spread / 100 * settings.size);
            return `${settings.inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${settings.size}px ${spreadRadius}px ${rgbaColor}`;
        } else {
            return `${offsetX}px ${offsetY}px ${settings.size}px ${rgbaColor}`;
        }
    }, [settings, shadowType]);

    // 处理设置变更
    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };
    
    // 复制到剪贴板功能
    const handleCopyToClipboard = () => {
        const cssRule = shadowType === 'box' ? `box-shadow: ${generatedCss};` : `text-shadow: ${generatedCss};`;
        const textarea = document.createElement('textarea');
        textarea.value = cssRule;
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('无法复制到剪贴板', err);
        }
        document.body.removeChild(textarea);
    };

    // 应用动态样式
    const previewStyle = {
        boxShadow: shadowType === 'box' ? generatedCss : 'none',
        textShadow: shadowType === 'text' ? generatedCss : 'none',
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-6xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                     <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <SlidersHorizontal className="text-cyan-400" />
                        <span>Photoshop 投影转 CSS 工具</span>
                    </h1>
                    <p className="text-gray-400 mt-2">实时将 Photoshop 投影参数转换为 CSS3 的 `box-shadow` 和 `text-shadow`。</p>
                </div>
                
                <div className="grid md:grid-cols-2">
                    {/* 控制面板 */}
                    <div className="p-6 space-y-6 bg-gray-800/50 border-r-0 md:border-r border-gray-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">阴影类型</label>
                            <div className="flex bg-gray-700 rounded-lg p-1">
                                <button onClick={() => setShadowType('box')} className={`w-1/2 p-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${shadowType === 'box' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                                    <Box size={16} /> 图层投影
                                </button>
                                <button onClick={() => setShadowType('text')} className={`w-1/2 p-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${shadowType === 'text' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                                    <Type size={16} /> 文字投影
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-center">
                             <div className="space-y-2">
                                <label htmlFor="color-text-input" className="text-sm font-medium text-gray-300">颜色</label>
                                <div className="flex items-center h-10 bg-gray-900 rounded-lg border border-gray-600 focus-within:ring-2 focus-within:ring-cyan-500 transition-all">
                                    <div className="relative w-10 h-10 flex-shrink-0">
                                        <div 
                                            className="w-full h-full rounded-l-md"
                                            style={{ backgroundColor: settings.color }}
                                        />
                                        <input
                                            type="color"
                                            value={settings.color}
                                            onChange={(e) => handleSettingChange('color', e.target.value)}
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <input
                                        id="color-text-input"
                                        type="text"
                                        value={settings.color}
                                        onChange={(e) => handleSettingChange('color', e.target.value)}
                                        className="w-full h-full bg-transparent font-mono text-cyan-400 focus:outline-none px-3"
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>
                           {shadowType === 'box' && (
                                <div className="flex items-center justify-end pt-5">
                                    <label htmlFor="inset" className="flex items-center cursor-pointer">
                                        <input
                                            id="inset"
                                            type="checkbox"
                                            checked={settings.inset}
                                            onChange={(e) => handleSettingChange('inset', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="relative w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-300">内阴影</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        <ControlSliderInput label="不透明度 (Opacity)" value={settings.opacity} onChange={(val) => handleSettingChange('opacity', val)} />
                        <ControlSliderInput label="角度 (Angle)" value={settings.angle} onChange={(val) => handleSettingChange('angle', val)} max={360} unit="°" />
                        <ControlSliderInput label="距离 (Distance)" value={settings.distance} onChange={(val) => handleSettingChange('distance', val)} max={100} unit="px" />
                        <ControlSliderInput label="大小 (Size / Blur)" value={settings.size} onChange={(val) => handleSettingChange('size', val)} max={200} unit="px" />
                        {shadowType === 'box' && (
                            <ControlSliderInput label="扩展 (Spread)" value={settings.spread} onChange={(val) => handleSettingChange('spread', val)} />
                        )}
                    </div>

                    {/* 预览和代码区 */}
                    <div className="p-6 space-y-6">
                        <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center p-4 border border-dashed border-gray-600">
                            {shadowType === 'box' ? (
                                <div className="w-32 h-32 bg-cyan-500 rounded-xl flex items-center justify-center transition-all duration-200" style={previewStyle}>
                                     <span className="font-bold text-white">预览</span>
                                </div>
                            ) : (
                                <h2 className="text-6xl font-extrabold text-cyan-500 transition-all duration-200" style={previewStyle}>
                                    你好
                                </h2>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">生成的 CSS</label>
                            <div className="relative">
                                <pre className="bg-gray-900 rounded-lg p-4 text-cyan-300 font-mono text-sm overflow-x-auto">
                                    <code>
                                        {shadowType === 'box' ? 'box-shadow' : 'text-shadow'}: {generatedCss};
                                    </code>
                                </pre>
                                <button onClick={handleCopyToClipboard} className="absolute top-2 right-2 p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-cyan-500 hover:text-white transition-colors">
                                    {isCopied ? <Check size={16} className="text-green-400"/> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;

