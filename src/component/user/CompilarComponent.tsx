import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Square, RotateCcw, Settings, Copy, Download, Upload, Maximize2, Minimize2, Sun, Moon } from 'lucide-react';
import Editor from '@monaco-editor/react';

const CompilerComponent = ({ problemData, code, setCode, onRunCode, onSubmitCode, loading }) => {
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [minimap, setMinimap] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isRunning, setIsRunning] = useState(false);
  
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  // Language configurations for Monaco Editor
  const languages = {
    javascript: { name: 'JavaScript', mode: 'javascript', ext: 'js' },
    python: { name: 'Python', mode: 'python', ext: 'py' },
    java: { name: 'Java', mode: 'java', ext: 'java' },
    cpp: { name: 'C++', mode: 'cpp', ext: 'cpp' },
  };

  const themes = {
    dark: { name: 'Dark', monacoTheme: 'vs-dark' },
    light: { name: 'Light', monacoTheme: 'vs' },
  };

  // Monaco Editor options
  // Replace your entire editorOptions object with this:
const editorOptions = {
  fontSize: fontSize,
  wordWrap: wordWrap ? 'on' : 'off',
  lineNumbers: lineNumbers ? 'on' : 'off',
  minimap: {
    enabled: minimap
  },
  automaticLayout: true,
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on',
  tabCompletion: 'on',
  parameterHints: {
    enabled: true
  },
  quickSuggestions: {
    other: true,
    comments: true,
    strings: true
  },
  folding: true,
  foldingHighlight: true,
  foldingImportsByDefault: false,
  bracketPairColorization: {
    enabled: true
  },
  // Completely disable guides
  guides: {
    bracketPairs: false,
    bracketPairsHorizontal: false,
    highlightActiveBracketPair: false,
    indentation: false
  },
  matchBrackets: 'always',
  autoClosingBrackets: 'always',
  autoClosingQuotes: 'always',
  autoIndent: 'advanced',
  formatOnPaste: true,
  formatOnType: true,
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  cursorBlinking: 'smooth',
  renderWhitespace: 'none',
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: 'line',
  mouseWheelZoom: true,
  contextmenu: true,
  links: true,
  colorDecorators: true,
  showFoldingControls: 'mouseover',
  showUnused: true,
  useShadows: false,
  insertSpaces: true,
  tabSize: 2,
  rulers: [],
  // Additional options to remove lines
  renderIndentGuides: false,
  highlightActiveIndentGuide: false,
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true
};

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Set up cursor position tracking
    editor.onDidChangeCursorPosition((e:any) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });

    // Add custom key bindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Handle save (you can add your save logic here)
      console.log('Save triggered');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Quick run with Ctrl+Enter
      handleRun();
    });

    // Set focus to editor
    editor.focus();
  };

  // Handle code changes
  const handleEditorChange = (value:any) => {
    setCode(value || '');
  };

  // Update starter code when language or problem changes
  useEffect(() => {
    if (problemData?.starterCode) {
      const starterCode = problemData.starterCode[language] || '';
      if (starterCode && starterCode !== code) {
        setCode(starterCode);
      }
    }
  }, [problemData, language]);

  const handleLanguageChange = useCallback((newLanguage:string) => {
    setLanguage(newLanguage);
    const starterCode = problemData?.starterCode?.[newLanguage] || '';
    setCode(starterCode);
  }, [problemData, setCode]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    try {
      await onRunCode(code,problemData._id,language);
    } finally {
      setIsRunning(false);
    }
  }, [onRunCode]);

  const handleSubmit = useCallback(async () => {
    try {
      await onSubmitCode();
    } catch (error) {
      console.error('Submission error:', error);
    }
  }, [onSubmitCode]);

  const resetCode = useCallback(() => {
    const starterCode = problemData?.starterCode?.[language] || '';
    setCode(starterCode);
  }, [problemData, language, setCode]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      console.log('Code copied to clipboard');
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [code]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const formatCode = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  }, []);
  

  return (
    <div 
      ref={containerRef}
      className={`h-full flex flex-col transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-white text-gray-900 border border-gray-200'
      } ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* Header Toolbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {Object.entries(languages).map(([key, lang]) => (
              <option key={key} value={key}>{lang.name}</option>
            ))}
          </select>

          {/* Theme Selector */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {Object.entries(themes).map(([key, themeOption]) => (
              <option key={key} value={key}>{themeOption.name}</option>
            ))}
          </select>

          {/* Font Size */}
          <div className="flex items-center gap-1">
            <span className="text-sm">Size:</span>
            <input
              type="range"
              min="10"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-16"
            />
            <span className="text-xs w-8">{fontSize}px</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={formatCode}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title="Format Code (Ctrl+Shift+I)"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={copyCode}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title="Copy Code (Ctrl+C)"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={resetCode}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen (F11)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 flex overflow-hidden relative">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={themes[theme].monacoTheme}
          options={editorOptions}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          loading={
            <div className={`flex items-center justify-center h-full ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}>
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading Editor...</p>
              </div>
            </div>
          }
        />
      </div>

      {/* Bottom Bar */}
      <div className={`flex items-center justify-between px-4 py-2 border-t text-sm ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700 text-gray-400' 
          : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}>
        <div className="flex items-center gap-4">
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
          <span>UTF-8</span>
          <span>{code?.length || 0} characters</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={loading || isRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              loading || isRunning
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            } text-white`}
          >
            {loading || isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run
              </>
            )}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              loading
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 active:scale-95'
            } text-white`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Square className="w-4 h-4" />
                Submit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompilerComponent;