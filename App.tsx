
import React, { useState, useCallback, useRef } from 'react';
import { Sidebar, Header, Button } from './components';
import { View, ContentItem } from './types';
import { gemini } from './gemini';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.WRITER);
  const [history, setHistory] = useState<ContentItem[]>([]);
  
  // Writer State
  const [writerPrompt, setWriterPrompt] = useState('');
  const [writerResult, setWriterResult] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  // Image Lab State
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageResult, setImageResult] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleGenerateText = async () => {
    if (!writerPrompt.trim()) return;
    setIsWriting(true);
    try {
      const result = await gemini.generateText(writerPrompt);
      setWriterResult(result);
      const newItem: ContentItem = {
        id: Date.now().toString(),
        type: 'text',
        title: writerPrompt.slice(0, 30) + (writerPrompt.length > 30 ? '...' : ''),
        content: result,
        timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev]);
    } catch (err) {
      alert("Error generating text. Check console.");
    } finally {
      setIsWriting(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    try {
      const result = await gemini.generateImage(imagePrompt);
      setImageResult(result);
      const newItem: ContentItem = {
        id: Date.now().toString(),
        type: 'image',
        title: imagePrompt,
        content: result,
        timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev]);
    } catch (err) {
      alert("Error generating image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case View.WRITER:
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
              <label className="block text-sm font-medium text-slate-400 mb-3">What are we writing today?</label>
              <textarea
                value={writerPrompt}
                onChange={(e) => setWriterPrompt(e.target.value)}
                placeholder="Write a blog post about the future of AI in 2030..."
                className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              />
              <div className="flex justify-end mt-4">
                <Button onClick={handleGenerateText} isLoading={isWriting}>
                  {isWriting ? 'Generating...' : 'Magic Write'}
                </Button>
              </div>
            </div>

            {writerResult && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                  <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Output</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(writerResult)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                <div className="p-8 prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-slate-200">
                  {writerResult}
                </div>
              </div>
            )}
          </div>
        );

      case View.IMAGE_LAB:
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
              <label className="block text-sm font-medium text-slate-400 mb-3">Describe your vision</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="A futuristic cybernetic garden at sunset, 8k, hyper-realistic"
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
                <Button onClick={handleGenerateImage} isLoading={isGeneratingImage}>
                  Generate
                </Button>
              </div>
            </div>

            {imageResult ? (
              <div className="flex flex-col items-center">
                <div className="relative group rounded-3xl overflow-hidden border border-slate-700 bg-slate-800/50 shadow-2xl max-w-lg w-full aspect-square">
                  <img src={imageResult} alt="Generated" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = imageResult;
                        link.download = 'lumina-gen.png';
                        link.click();
                      }}
                      className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform"
                    >
                      Download High Res
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-slate-500 text-sm italic">" {imagePrompt} "</p>
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
                <span className="text-4xl mb-4">🖼️</span>
                <p>Your creation will appear here</p>
              </div>
            )}
          </div>
        );

      case View.HISTORY:
        return (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.length === 0 ? (
                <div className="col-span-full py-20 text-center text-slate-600">
                   <p className="text-lg">No history yet. Start creating!</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all group">
                    {item.type === 'image' ? (
                      <div className="aspect-video relative overflow-hidden">
                        <img src={item.content} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-[10px] uppercase font-bold text-white">Image</div>
                      </div>
                    ) : (
                      <div className="p-5 h-40 overflow-hidden relative">
                         <div className="absolute top-2 right-2 px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-[10px] uppercase font-bold">Text</div>
                         <h3 className="font-semibold text-slate-200 mb-2 truncate pr-12">{item.title}</h3>
                         <p className="text-sm text-slate-400 line-clamp-4">{item.content}</p>
                         <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-900 to-transparent"></div>
                      </div>
                    )}
                    <div className="px-5 py-4 bg-slate-800/30 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 uppercase font-medium">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <button 
                        onClick={() => {
                          if (item.type === 'text') {
                            setWriterResult(item.content);
                            setWriterPrompt(item.title);
                            setView(View.WRITER);
                          } else {
                            setImageResult(item.content);
                            setImagePrompt(item.title);
                            setView(View.IMAGE_LAB);
                          }
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        REOPEN
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 flex flex-col min-w-0">
        <Header title={view.charAt(0).toUpperCase() + view.slice(1).replace('_', ' ')} />
        <div className="p-8 flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
