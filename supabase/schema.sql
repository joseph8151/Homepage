-- Supabase SQL Editor에서 한 번 실행하십시오.
-- 상담 데이터는 서버(service role)만 접근합니다. anon/authenticated 에는 어떤 정책도 부여하지 않습니다.

create extension if not exists "pgcrypto";

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  company text not null check (char_length(company) between 1 and 300),
  email text not null check (char_length(email) <= 300),
  phone text not null check (char_length(phone) <= 50),
  selected_services text[] not null default '{}',
  budget text not null,
  timeline text not null,
  project_description text not null check (char_length(project_description) <= 6000),
  current_website text,
  reference_website text,
  attachment_path text,
  preferred_contact text,
  privacy_consent boolean not null check (privacy_consent = true),
  consent_version text not null,
  status text not null default 'NEW'
    check (status in ('NEW','CONTACTED','QUOTED','IN PROGRESS','CLOSED'))
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);

alter table public.inquiries enable row level security;
-- 정책 없음 = anon/authenticated 접근 전면 차단 (service role은 RLS를 우회)

-- 사이트 콘텐츠(가격·포트폴리오·블로그·기본정보 덮어쓰기). 공개 읽기, 쓰기는 서버만.
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
drop policy if exists "site_content public read" on public.site_content;
create policy "site_content public read" on public.site_content for select to anon, authenticated using (true);

-- 첨부파일용 비공개 버킷 (정책 없음 = 서버만 접근)
insert into storage.buckets (id, name, public, file_size_limit)
values ('inquiry-attachments', 'inquiry-attachments', false, 10485760)
on conflict (id) do nothing;

-- 보존·삭제 정책 예시: 종결 후 3년이 지난 상담 삭제(첨부 파일은 관리자 화면 또는 별도 작업으로 삭제)
-- delete from public.inquiries where status = 'CLOSED' and created_at < now() - interval '3 years';
