import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Play,
  RotateCcw,
  Settings,
  Copy,
  Maximize2,
  Minimize2,
  UploadCloud,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { CompilerComponentProps } from "../../types/component.types";

const CompilerComponent: React.FC<CompilerComponentProps> = ({
  problemData,
  code,
  setCode,
  onRunCode,
  onSubmitCode,
  loading,
}) => {
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [minimap, setMinimap] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editorRef = useRef(null);
  const containerRef = useRef(null);

  const languages = {
    javascript: { name: "JavaScript", mode: "javascript", ext: "js" },
    python: { name: "Python", mode: "python", ext: "py" },
    java: { name: "Java", mode: "java", ext: "java" },
    cpp: { name: "C++", mode: "cpp", ext: "cpp" },
  };

  const themes = {
    dark: { name: "Dark", monacoTheme: "vs-dark" },
    light: { name: "Light", monacoTheme: "vs" },
  };

  const editorOptions = useMemo(
    () => ({
      fontSize: fontSize,
      wordWrap: (wordWrap ? "on" : "off") as "on" | "off",
      lineNumbers: (lineNumbers ? "on" : "off") as "on" | "off",
      minimap: {
        enabled: minimap,
      },
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: "on" as const,
      tabCompletion: "on" as const,
      parameterHints: {
        enabled: true,
      },
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      folding: true,
      foldingHighlight: true,
      foldingImportsByDefault: false,
      bracketPairColorization: {
        enabled: true,
      },
      guides: {
        bracketPairs: false,
        bracketPairsHorizontal: false,
        highlightActiveBracketPair: false,
        indentation: false,
      },
      matchBrackets: "always" as const,
      autoClosingBrackets: "always" as const,
      autoClosingQuotes: "always" as const,
      autoIndent: "advanced" as const,
      formatOnPaste: true,
      formatOnType: true,
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: "smooth" as const,
      renderWhitespace: "none" as const,
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: "line" as const,
      mouseWheelZoom: true,
      contextmenu: true,
      links: true,
      colorDecorators: true,
      showFoldingControls: "mouseover" as const,
      showUnused: true,
      useShadows: false,
      insertSpaces: true,
      tabSize: 2,
      rulers: [],
      renderIndentGuides: false,
      highlightActiveIndentGuide: false,
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
    }),
    [fontSize, wordWrap, lineNumbers, minimap]
  );

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log("Save triggered");
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun();
    });

    editor.focus();
  };

  const handleEditorChange = (value: any) => {
    setCode(value || "");
  };

  const buildFunctionComment = (
    params: Array<{ type: string; name: string }>,
    returnType: string
  ) => {
    if (!params || !returnType) return "hello";
    const paramsComment = params
      .map((p) => ` * @param {${p.type}} ${p.name}`)
      .join("\n");
    const returnComment = ` * @return {${returnType}}`;
    return `/**\n${paramsComment}\n${returnComment}\n*/\n`;
  };

  useEffect(() => {
    if (problemData?.starterCode) {
      const starterCode = problemData.starterCode[language] || "";
      const comment = buildFunctionComment(
        problemData.parameters,
        problemData.returnType
      );
      console.log("comont", comment);
      if (starterCode && comment + starterCode !== code) {
        setCode(comment + starterCode);
      }
    }
  }, [problemData, language]);

  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      setLanguage(newLanguage);
      const starterCode = problemData?.starterCode?.[newLanguage] || "";
      setCode(starterCode);
    },
    [problemData, setCode]
  );

  const handleRun = useCallback(async () => {
    if (!problemData?._id) return;
    setIsRunning(true);
    try {
      await onRunCode(code, problemData._id, language);
    } finally {
      setIsRunning(false);
    }
  }, [onRunCode, code, problemData, language]);

  const handleSubmit = useCallback(async () => {
    if (!problemData?._id) return;
    setIsSubmitting(true);
    try {
      await onSubmitCode(code, problemData._id, language);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmitCode, code, problemData, language]);

  const resetCode = useCallback(() => {
    const starterCode = problemData?.starterCode?.[language] || "";
    setCode(starterCode);
  }, [problemData, language, setCode]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      console.log("Code copied to clipboard");
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  }, [code]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const formatCode = useCallback(() => {
    if (editorRef.current) {
      (editorRef.current as any)
        .getAction("editor.action.formatDocument")
        .run();
    }
  }, []);
  return (
    <div
      ref={containerRef}
      className={`h-full flex flex-col transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-900 border border-gray-200"
      } ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      <div
        className={`flex items-center justify-between px-4 py-2 border-b ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {Object.entries(languages).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {Object.entries(themes).map(([key, themeOption]) => (
              <option key={key} value={key}>
                {themeOption.name}
              </option>
            ))}
          </select>

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

        <div className="flex items-center gap-2">
          <button
            onClick={formatCode}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            title="Format Code (Ctrl+Shift+I)"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={copyCode}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            title="Copy Code (Ctrl+C)"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={resetCode}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen (F11)"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={themes[theme as keyof typeof themes].monacoTheme}
          options={editorOptions}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          loading={
            <div
              className={`flex items-center justify-center h-full ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              }`}
            >
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading Editor...</p>
              </div>
            </div>
          }
        />
      </div>

      <div
        className={`flex items-center justify-between px-4 py-2 border-t text-sm ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-400"
            : "bg-gray-50 border-gray-200 text-gray-600"
        }`}
      >
        <div className="flex items-center gap-4">
          <span>
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
          <span>UTF-8</span>
          <span>{code?.length || 0} characters</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className={`
    flex items-center justify-center gap-2 px-6 py-2.5 
    rounded-md font-medium text-sm transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
    ${
      isRunning || isSubmitting
        ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600"
        : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md focus:ring-blue-500 border border-blue-600"
    }
  `}
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
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
            disabled={isRunning || isSubmitting}
            className={`
    flex items-center justify-center gap-2 px-6 py-2.5 
    rounded-md font-medium text-sm transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
    ${
      isRunning || isSubmitting
        ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600"
        : "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md focus:ring-green-500 border border-green-600"
    }
  `}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
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
