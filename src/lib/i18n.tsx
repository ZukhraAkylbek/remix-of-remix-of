import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { RU_TO_KY } from "@/lib/i18n-dictionary";

export type Lang = "ru" | "ky";

const STORAGE_KEY = "site-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (ru: string) => string };

const LanguageContext = createContext<Ctx>({ lang: "ru", setLang: () => {}, t: (ru) => ru });

export function useLanguage() {
  return useContext(LanguageContext);
}

function translate(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const hit = RU_TO_KY[trimmed];
  if (!hit) return null;
  return text.replace(trimmed, hit);
}

/** Оригинальные русские тексты узлов, чтобы возвращать их при переключении на «Рус». */
const originals = new WeakMap<Text, string>();

function translateNode(node: Text, lang: Lang) {
  const original = originals.get(node) ?? node.nodeValue ?? "";
  if (lang === "ru") {
    if (originals.has(node) && node.nodeValue !== original) node.nodeValue = original;
    return;
  }
  const next = translate(original);
  if (next && next !== node.nodeValue) {
    originals.set(node, original);
    node.nodeValue = next;
  }
}

function walk(root: Node, lang: Lang) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const parent = (n as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT")
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let current = walker.nextNode();
  while (current) {
    translateNode(current as Text, lang);
    current = walker.nextNode();
  }
  if (root instanceof Element || root instanceof Document) {
    const scope = root instanceof Document ? root.body : root;
    scope?.querySelectorAll<HTMLElement>("[placeholder],[title],[aria-label]").forEach((el) => {
      (["placeholder", "title", "aria-label"] as const).forEach((attr) => {
        const value = el.getAttribute(attr);
        if (!value) return;
        const key = `data-orig-${attr}`;
        const stored = el.getAttribute(key);
        const original = stored ?? value;
        if (lang === "ru") {
          if (stored) el.setAttribute(attr, original);
          return;
        }
        const next = translate(original);
        if (next && next !== value) {
          el.setAttribute(key, original);
          el.setAttribute(attr, next);
        }
      });
    });
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ky" || saved === "ru") setLangState(saved);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* приватный режим — просто игнорируем */
    }
  }, []);

  // Переводим уже отрисованный DOM и всё, что появляется позже.
  useEffect(() => {
    document.documentElement.lang = lang === "ky" ? "ky" : "ru";
    walk(document, lang);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) translateNode(node as Text, lang);
          else if (node.nodeType === Node.ELEMENT_NODE) walk(node, lang);
        });
        if (record.type === "characterData" && record.target.nodeType === Node.TEXT_NODE) {
          translateNode(record.target as Text, lang);
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (ru: string) => (lang === "ky" ? (RU_TO_KY[ru.trim()] ?? ru) : ru),
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
