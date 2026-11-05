import "server-only";
import { defaultServices } from "@/content/services";
import { SITE_URL } from "@/content/site";
import { secret } from "./cf";

type N = { name: string; company: string; services: string[]; budget: string; timeline: string; hasFile: boolean };
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const withTimeout = (p: Promise<Response>) => Promise.race([p, new Promise<never>((_, r) => setTimeout(() => r(new Error("timeout")), 5000))]);

/**
 * 신규 상담 알림(선택). 설정된 채널만 사용하며, 실패해도 상담 접수 자체에는 영향을 주지 않습니다.
 * - 이메일: RESEND_API_KEY, NOTIFY_EMAIL_TO, NOTIFY_EMAIL_FROM (Resend)
 * - 웹훅: NOTIFY_WEBHOOK_URL (Slack/Discord 호환 JSON {text, content})
 * 개인정보 최소화를 위해 연락처·이메일·본문은 알림에 싣지 않고 관리자 링크만 제공합니다.
 */
export async function notifyNewInquiry(n: N) {
  const svc = n.services.map((s) => defaultServices.find((x) => x.slug === s)?.name ?? s).join(", ");
  const link = `${SITE_URL}/admin`;
  const text = `새 상담 신청\n${n.company} / ${n.name}\n관심 서비스: ${svc}\n예산: ${n.budget} · 일정: ${n.timeline}${n.hasFile ? " · 첨부 있음" : ""}\n확인: ${link}`;
  const jobs: Promise<unknown>[] = [];

  const key = secret("RESEND_API_KEY"), to = secret("NOTIFY_EMAIL_TO"), from = secret("NOTIFY_EMAIL_FROM");
  if (key && to && from) {
    jobs.push(withTimeout(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: to.split(",").map((x) => x.trim()), subject: `[상담 신청] ${n.company} / ${n.name}`, html: `<p>${esc(text).replace(/\n/g, "<br>")}</p>` }),
    })));
  }
  const hook = secret("NOTIFY_WEBHOOK_URL");
  if (hook && /^https:\/\//.test(hook)) {
    jobs.push(withTimeout(fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, content: text }) })));
  }
  const res = await Promise.allSettled(jobs);
  res.forEach((r) => r.status === "rejected" && console.error("[notify] failed", String(r.reason)));
}
