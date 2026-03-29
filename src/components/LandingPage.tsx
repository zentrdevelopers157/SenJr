'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SignOutButton, useUser } from "@clerk/nextjs";
import { WaitlistForm } from './WaitlistForm';
import { HomeConnectButton } from './HomeConnectButton';

export default function LandingPage({ hasUser = false }: { hasUser?: boolean }) {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    // Scroll reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
    
    // Smooth nav highlight
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="landing-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');

        .landing-wrapper {
          --bg:       #0B1020;
          --bg2:      #121A2B;
          --orange:   #f97316;
          --orange2:  #ea580c;
          --primary-blue: #2563EB;
          --offwhite: #F8F5F0;
          --muted:    #94A3B8;
          --border:   rgba(255,255,255,0.08);
          --glass-bg: rgba(255,255,255,0.05);
          --glass-border: rgba(255,255,255,0.1);
          
          background: var(--bg);
          color: var(--offwhite);
          font-family: 'Manrope', sans-serif;
          overflow-x: hidden;
          position: relative;
          min-height: 100vh;
        }

        .landing-wrapper * {
          box-sizing: border-box;
          margin: 0; padding: 0;
        }

        /* ── NOISE TEXTURE ── */
        .landing-wrapper::before {
          content: '';
          position: fixed; inset: 0; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        /* ── GLOW BLOBS ── */
        .blobs {
          position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none;
        }
        .blob {
          position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.18;
        }
        .b1 { width: 700px; height: 700px; background: #2563EB; top: -200px; left: -200px; animation: drift1 18s ease-in-out infinite; }
        .b2 { width: 500px; height: 500px; background: #f97316; bottom: -100px; right: -150px; animation: drift2 22s ease-in-out infinite; }
        .b3 { width: 300px; height: 300px; background: #1E3A8A; top: 50%; left: 40%; opacity: 0.1; animation: drift3 14s ease-in-out infinite; }

        @keyframes drift1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,40px)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,-60px)} }
        @keyframes drift3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-30px)} }

        /* ── PAGE ── */
        .lp-page { position: relative; z-index: 1; }

        /* ── NAV ── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 32px;
          height: 68px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(13,13,13,0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          transition: background 0.3s;
        }
        .lp-nav.scrolled {
          background: rgba(13,13,13,0.9);
        }

        .nav-logo {
          font-size: 26px; font-weight: 900;
          letter-spacing: -0.04em; color: var(--offwhite);
          text-decoration: none;
        }
        .nav-logo span { color: var(--primary-blue); }

        .nav-links {
          display: flex; gap: 32px; list-style: none;
        }
        .nav-links a {
          font-size: 14px; font-weight: 600;
          color: var(--muted); text-decoration: none;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--offwhite); }

        .nav-cta {
          display: flex; gap: 10px; align-items: center;
        }

        .lp-btn {
          padding: 10px 22px; border-radius: 10px;
          font-size: 14px; font-weight: 700;
          font-family: 'Manrope', sans-serif;
          cursor: pointer; border: none;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
        }

        .btn-ghost {
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
        }
        .btn-ghost:hover { color: var(--offwhite); border-color: rgba(255,255,255,0.2); }

        .btn-primary {
          background: var(--orange);
          color: #fff;
          box-shadow: 0 4px 24px rgba(249,115,22,0.35);
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: linear-gradient(
            45deg,
            transparent 45%,
            rgba(255,255,255,0.1) 50%,
            transparent 55%
          );
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          20%, 100% { transform: translateX(100%) rotate(45deg); }
        }
        .btn-primary:hover { 
          background: var(--orange2); 
          transform: translateY(-2px); 
          box-shadow: 0 8px 32px rgba(249,115,22,0.5); 
        }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          position: relative;
        }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(249,115,22,0.1);
          border: 1px solid rgba(249,115,22,0.25);
          backdrop-filter: blur(12px);
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--orange2);
          margin-bottom: 32px;
          animation: fadeUp 0.7s ease forwards;
        }

        .eyebrow-dot {
          width: 6px; height: 6px;
          background: var(--orange);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)}
        }

        .hero h1 {
          font-size: clamp(42px, 7vw, 88px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.0;
          color: var(--offwhite);
          margin-bottom: 12px;
          animation: fadeUp 0.7s 0.1s ease both;
        }

        .hero h1 .blue { 
          color: var(--primary-blue); 
          background: linear-gradient(to right, #2563EB, #3B82F6);
          -webkit-background-clip: text;
          background-clip: text;
        }
        
        .hero h1 .outline {
          background: linear-gradient(to right, #2563EB, #3B82F6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-style: normal;
          display: inline-block;
          letter-spacing: -0.02em;
        }

        .hero-sub {
          font-size: clamp(16px, 2vw, 20px);
          font-weight: 500;
          color: var(--muted);
          max-width: 520px;
          line-height: 1.7;
          margin: 20px auto 40px;
          animation: fadeUp 0.7s 0.2s ease both;
        }

        .hero-sub strong { color: var(--offwhite); }

        .hero-actions {
          display: flex; gap: 12px; flex-wrap: wrap;
          justify-content: center;
          animation: fadeUp 0.7s 0.3s ease both;
          margin-bottom: 64px;
        }

        .btn-large {
          padding: 16px 32px;
          font-size: 16px; border-radius: 14px;
        }

        /* ── SOCIAL PROOF BAR ── */
        .proof-bar {
          display: flex; align-items: center; gap: 32px;
          flex-wrap: wrap; justify-content: center;
          animation: fadeUp 0.7s 0.4s ease both;
        }

        .proof-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: var(--muted); font-weight: 600;
        }

        .proof-avatars { display: flex; }

        .proof-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          border: 2px solid var(--bg);
          margin-left: -8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800;
          background: linear-gradient(135deg, var(--orange), #ea580c);
          color: white;
        }

        .proof-avatar:first-child { margin-left: 0; }

        .proof-sep { width: 1px; height: 20px; background: var(--border); }

        /* ── MOCKUP ── */
        .hero-mockup {
          margin-top: 80px; position: relative;
          width: 100%; max-width: 900px;
          animation: fadeUp 0.9s 0.5s ease both;
          text-align: left;
        }

        .mockup-frame {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 20px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
        }

        .mockup-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }

        .mock-dot { width: 10px; height: 10px; border-radius: 50%; }
        .md-r { background: #ff5f57; }
        .md-y { background: #febc2e; }
        .md-g { background: #28c840; }

        .mockup-url {
          flex: 1; background: rgba(255,255,255,0.05);
          border: 1px solid var(--border); border-radius: 8px;
          padding: 6px 14px; font-size: 12px; color: var(--muted);
          font-family: monospace;
        }

        .mockup-content {
          background: var(--bg2); border-radius: 14px;
          overflow: hidden; min-height: 320px;
          display: grid; grid-template-columns: 240px 1fr;
        }

        .mock-sidebar {
          background: rgba(255,255,255,0.03); border-right: 1px solid var(--border);
          padding: 20px 16px; display: flex; flex-direction: column; gap: 8px;
        }

        .mock-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          font-size: 13px; font-weight: 600;
          color: var(--muted); cursor: pointer; transition: all 0.15s;
        }

        .mock-nav-item.active { background: rgba(249,115,22,0.12); color: var(--orange2); }
        .mock-nav-item:hover:not(.active) { background: rgba(255,255,255,0.04); color: var(--offwhite); }

        .mock-main { padding: 20px; display: flex; flex-direction: column; gap: 12px; }

        .mock-post {
          background: rgba(255,255,255,0.04); border: 1px solid var(--border);
          border-radius: 12px; padding: 14px 16px;
        }

        .mock-post-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }

        .mock-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; color: white; flex-shrink: 0;
        }

        .mock-post-meta { display: flex; flex-direction: column; }
        .mock-post-name { font-size: 13px; font-weight: 700; color: var(--offwhite); }
        .mock-post-tag  { font-size: 11px; color: var(--muted); }

        .mock-badge-small {
          margin-left: auto; font-size: 10px; font-weight: 700;
          padding: 3px 8px; border-radius: 6px;
          background: rgba(249,115,22,0.15); color: var(--orange2);
          border: 1px solid rgba(249,115,22,0.2);
        }

        .mock-post-text { font-size: 13px; color: rgba(250,247,242,0.6); line-height: 1.6; }
        .mock-post-actions { display: flex; gap: 16px; margin-top: 10px; }
        .mock-action { font-size: 12px; font-weight: 600; color: var(--muted); display: flex; align-items: center; gap: 5px; }

        /* ── SECTIONS SHARED ── */
        .lp-section { padding: 100px 24px; }
        .section-tag {
          display: inline-block; font-size: 11px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--orange); background: rgba(249,115,22,0.1);
          border: 1px solid rgba(249,115,22,0.2);
          padding: 5px 14px; border-radius: 100px; margin-bottom: 20px;
        }
        .section-title {
          font-size: clamp(28px, 4vw, 48px); font-weight: 900;
          letter-spacing: -0.03em; line-height: 1.1;
          color: var(--offwhite); margin-bottom: 16px;
        }
        .section-sub { font-size: 17px; color: var(--muted); line-height: 1.7; max-width: 500px; margin: 0 auto; }
        .center { text-align: center; margin: 0 auto; }

        /* ── HOW IT WORKS ── */
        .hiw { max-width: 960px; margin: 0 auto; }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 60px; }
        .step {
          background: var(--glass-bg); backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border); border-radius: 20px;
          padding: 32px 28px; position: relative;
          transition: transform 0.2s, box-shadow 0.2s; overflow: hidden; text-align: left;
        }
        .step::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--orange), transparent);
        }
        .step:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .step-num {
          font-size: 48px; font-weight: 900; color: rgba(249,115,22,0.15);
          letter-spacing: -0.04em; line-height: 1; margin-bottom: 16px;
        }
        .step-icon { font-size: 28px; margin-bottom: 14px; }
        .step h3 { font-size: 18px; font-weight: 800; color: var(--offwhite); margin-bottom: 8px; }
        .step p { font-size: 14px; color: var(--muted); line-height: 1.7; }

        /* ── MENTOR SHOWCASE ── */
        .mentors-section { max-width: 960px; margin: 0 auto; }
        .mentor-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px; margin-top: 56px;
        }
        .mentor-card {
          background: var(--glass-bg); backdrop-filter: blur(24px);
          border: 1px solid var(--glass-border); border-radius: 20px;
          padding: 28px 24px; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; text-align: left;
        }
        .mentor-card:hover {
          transform: translateY(-4px); border-color: rgba(249,115,22,0.3);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .mc-top { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .mc-avatar {
          width: 52px; height: 52px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 900; color: white; flex-shrink: 0;
        }
        .mc-name { font-size: 16px; font-weight: 800; color: var(--offwhite); }
        .mc-inst { font-size: 13px; color: var(--muted); margin-top: 2px; }
        .mc-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }
        .mc-tag {
          font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px;
          background: rgba(255,255,255,0.06); border: 1px solid var(--border); color: rgba(250,247,242,0.6);
        }
        .mc-tag.hot { background: rgba(249,115,22,0.12); border-color: rgba(249,115,22,0.2); color: var(--orange2); }
        .mc-stats { display: flex; gap: 20px; padding-top: 16px; border-top: 1px solid var(--border); }
        .mc-stat { display: flex; flex-direction: column; }
        .mc-stat-val { font-size: 16px; font-weight: 800; color: var(--offwhite); }
        .mc-stat-key { font-size: 11px; color: var(--muted); font-weight: 600; margin-top: 1px; }
        .mc-btn {
          width: 100%; margin-top: 16px; padding: 11px; border-radius: 10px;
          background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.2);
          color: var(--orange2); font-size: 13px; font-weight: 700;
          font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.2s;
        }
        .mc-btn:hover { background: var(--orange); color: white; border-color: var(--orange); }

        /* ── PRICING ── */
        .pricing-section { max-width: 860px; margin: 0 auto; }
        .pricing-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px; margin-top: 56px; align-items: start;
        }
        .price-card {
          background: var(--glass-bg); backdrop-filter: blur(24px); border: 1px solid var(--glass-border); border-radius: 22px; padding: 36px 28px; transition: transform 0.2s; position: relative; overflow: hidden; text-align: left;
        }
        .price-card:hover { transform: translateY(-4px); }
        .price-card.featured { border-color: rgba(249,115,22,0.35); background: rgba(249,115,22,0.06); }
        .price-card.featured::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--orange), var(--orange2)); }
        .price-badge { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--orange); background: rgba(249,115,22,0.12); border: 1px solid rgba(249,115,22,0.2); padding: 4px 12px; border-radius: 100px; margin-bottom: 20px; }
        .price-name { font-size: 22px; font-weight: 900; color: var(--offwhite); margin-bottom: 8px; }
        .price-amount { font-size: 48px; font-weight: 900; color: var(--offwhite); letter-spacing: -0.03em; line-height: 1; margin-bottom: 4px; }
        .price-amount sup { font-size: 24px; vertical-align: top; margin-top: 8px; display: inline-block; }
        .price-amount sub { font-size: 16px; color: var(--muted); font-weight: 600; }
        .price-desc { font-size: 13px; color: var(--muted); margin-bottom: 28px; line-height: 1.6; }
        .price-features { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
        .pf { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: rgba(250,247,242,0.7); line-height: 1.5; }
        .pf-check { width: 18px; height: 18px; border-radius: 50%; background: rgba(249,115,22,0.15); border: 1px solid rgba(249,115,22,0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 10px; color: var(--orange); }
        .pf-check.muted { background: rgba(255,255,255,0.05); border-color: var(--border); color: var(--muted); }

        /* ── WAITLIST ── */
        .waitlist-section { max-width: 620px; margin: 0 auto; text-align: center; }
        .waitlist-box { background: var(--glass-bg); backdrop-filter: blur(28px); border: 1px solid var(--glass-border); border-radius: 28px; padding: 56px 48px; margin-top: 48px; position: relative; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.4); text-align: left; }
        .waitlist-box::before { content: ''; position: absolute; top: 0; left: 20%; right: 20%; height: 1px; background: linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent); }
        .waitlist-count { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.15); border-radius: 100px; padding: 8px 18px; font-size: 13px; font-weight: 700; color: var(--orange2); margin-bottom: 28px; width: fit-content; margin-left: auto; margin-right: auto; }
        .waitlist-count-wrapper { text-align: center; margin-bottom: 28px; }
        .waitlist-box h2 { font-size: 32px; font-weight: 900; letter-spacing: -0.03em; color: var(--offwhite); margin-bottom: 12px; line-height: 1.2; text-align: center; }
        .waitlist-box p.subtitle { font-size: 15px; color: var(--muted); line-height: 1.7; margin-bottom: 32px; text-align: center; }
        .waitlist-form { display: flex; flex-direction: column; gap: 12px; }
        .wf-row { display: flex; gap: 10px; }
        .wf-input { flex: 1; padding: 14px 18px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 12px; font-size: 14px; font-weight: 500; color: var(--offwhite); font-family: 'Manrope', sans-serif; transition: border-color 0.2s; outline: none; }
        .wf-input::placeholder { color: var(--muted); }
        .wf-input:focus { border-color: rgba(249,115,22,0.4); }
        .wf-select { padding: 14px 18px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 12px; font-size: 14px; font-weight: 500; color: var(--offwhite); font-family: 'Manrope', sans-serif; outline: none; cursor: pointer; appearance: none; width: 100%; }
        .wf-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 8px;
        }
        .wf-tag:hover { border-color: rgba(255,255,255,0.2); color: var(--offwhite); }
        .wf-tags-group { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 10px; 
          margin-bottom: 24px; 
        }
        .wf-select option { background: #1a1a1a; color: var(--offwhite); }
        .wf-submit { padding: 16px; background: var(--orange); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 800; font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 24px rgba(249,115,22,0.3); }
        .wf-submit:hover { background: var(--orange2); transform: translateY(-1px); box-shadow: 0 6px 32px rgba(249,115,22,0.45); }
        .wf-note { font-size: 12px; color: var(--muted); margin-top: 8px; text-align: center; }
        .success-msg { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px; }
        .success-icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(249,115,22,0.15); border: 2px solid rgba(249,115,22,0.3); display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .success-msg h3 { font-size: 20px; font-weight: 800; color: var(--offwhite); }
        .success-msg p { font-size: 14px; color: var(--muted); text-align: center; line-height: 1.6; }

        /* ── FOOTER ── */
        .lp-footer { border-top: 1px solid var(--border); padding: 48px 32px 32px; max-width: 960px; margin: 0 auto; position: relative; z-index: 1;}
        .footer-top { display: flex; flex-wrap: wrap; gap: 40px; justify-content: space-between; margin-bottom: 40px; }
        .footer-brand .nav-logo { font-size: 22px; margin-bottom: 10px; display: block;}
        .footer-brand p { font-size: 13px; color: var(--muted); max-width: 240px; line-height: 1.7; }
        .footer-col h4 { font-size: 13px; font-weight: 700; color: var(--offwhite); margin-bottom: 14px; }
        .footer-col a { display: block; font-size: 13px; color: var(--muted); text-decoration: none; margin-bottom: 8px; transition: color 0.15s; }
        .footer-col a:hover { color: var(--offwhite); }
        .footer-bottom { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; padding-top: 28px; border-top: 1px solid var(--border); font-size: 12px; color: var(--muted); }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .mockup-content { grid-template-columns: 1fr; }
          .mock-sidebar { display: none; }
          .wf-row { flex-direction: column; }
          .waitlist-box { padding: 36px 24px; }
          .footer-top { flex-direction: column; }
        }
      `}} />

      <div className="blobs">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
      </div>

      <div className="lp-page">
        {/* NAV */}
        <nav className={`lp-nav ${navScrolled ? 'scrolled' : ''}`}>
          <a href="#" className="nav-logo">Sen<span>jr</span></a>
          <ul className="nav-links">
            <li><a href="#how">How it works</a></li>
            <li><a href="#mentors">Mentors</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
          <div className="nav-cta">
            {hasUser ? (
              <>
                <Link href="/dashboard" className="lp-btn btn-primary" style={{color: 'white'}}>Dashboard &rarr;</Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/student/login" className="lp-btn btn-ghost" style={{color: 'white'}}>Log in</Link>
                <a href="#waitlist" className="lp-btn btn-primary" style={{color: 'white'}}>Join Waitlist &rarr;</a>
              </>
            )}
          </div>
        </nav>

        {/* HERO */}
        <section className="hero lp-section">
          <div className="hero-eyebrow"><div className="eyebrow-dot"></div> Now in Beta — 2,400+ students joined</div>
          <h1>Your senior<br/><span className="blue">already</span> cracked it.<br/>Now <span className="outline">so will you.</span></h1>
          <p className="hero-sub">
            <strong>Senjr</strong> connects students with seniors from IITs, IIMs, AIIMS, Harvard & beyond — for real guidance, study memes, and a community that actually gets the grind.
          </p>
          <div className="hero-actions">
            <a href="#waitlist" className="lp-btn btn-primary btn-large group">
              Get Early Access ✦
              <span className="inline-block transition-transform group-hover:translate-x-1">&#x2197;</span>
            </a>
            <a href="#how" className="lp-btn btn-ghost btn-large hover:bg-white/5 transition-colors">
              See how it works
            </a>
          </div>
          <div className="proof-bar">
            <div className="proof-item">
              <div className="proof-avatars">
                <div className="proof-avatar">A</div>
                <div className="proof-avatar" style={{background: 'linear-gradient(135deg,#ea580c,#c2410c)'}}>R</div>
                <div className="proof-avatar" style={{background: 'linear-gradient(135deg,#d97706,#b45309)'}}>S</div>
                <div className="proof-avatar" style={{background: 'linear-gradient(135deg,#7c3aed,#6d28d9)'}}>P</div>
              </div>
              2,400+ students on waitlist
            </div>
            <div className="proof-sep"></div>
            <div className="proof-item">⭐ 4.9 avg mentor rating</div>
            <div className="proof-sep"></div>
            <div className="proof-item">🌍 Students from 28 countries</div>
          </div>

          {/* APP MOCKUP */}
          <div className="hero-mockup">
            <div className="mockup-frame">
              <div className="mockup-bar">
                <div className="mock-dot md-r"></div>
                <div className="mock-dot md-y"></div>
                <div className="mock-dot md-g"></div>
                <div className="mockup-url">app.senjr.co · Home Feed</div>
              </div>
              <div className="mockup-content">
                <div className="mock-sidebar">
                  <div style={{fontSize: '18px', fontWeight: 900, letterSpacing: '-0.03em', color: '#faf7f2', marginBottom: '16px', padding: '0 4px'}}>Sen<span style={{color: '#f97316'}}>jr</span></div>
                  <div className="mock-nav-item active">🏠 Home Feed</div>
                  <div className="mock-nav-item">🎓 Find a Senior</div>
                  <div className="mock-nav-item">💬 Messages</div>
                  <div className="mock-nav-item">📚 Resources</div>
                  <div className="mock-nav-item">🔥 Streaks</div>
                  <div style={{marginTop: 'auto'}}>
                    <div className="mock-nav-item">⚙️ Settings</div>
                  </div>
                </div>
                <div className="mock-main">
                  <div className="mock-post">
                    <div className="mock-post-header">
                      <div className="mock-avatar" style={{background: 'linear-gradient(135deg,#f97316,#ea580c)'}}>A</div>
                      <div className="mock-post-meta">
                        <div className="mock-post-name">Arjun Sharma</div>
                        <div className="mock-post-tag">IIT Bombay · JEE AIR 247</div>
                      </div>
                      <div className="mock-badge-small">IIT Verified ✓</div>
                    </div>
                    <div className="mock-post-text">POV: You're studying at 2am and suddenly everything clicks 🤯 This is what 6 months of consistent practice looks like. Here's the exact schedule I used to crack JEE Advanced...</div>
                    <div className="mock-post-actions">
                      <span className="mock-action">🔥 847</span>
                      <span className="mock-action">💬 134</span>
                      <span className="mock-action">📌 Save</span>
                    </div>
                  </div>
                  <div className="mock-post">
                    <div className="mock-post-header">
                      <div className="mock-avatar" style={{background: 'linear-gradient(135deg,#7c3aed,#6d28d9)'}}>P</div>
                      <div className="mock-post-meta">
                        <div className="mock-post-name">Priya Nair</div>
                        <div className="mock-post-tag">AIIMS Delhi · NEET 720/720</div>
                      </div>
                      <div className="mock-badge-small">AIIMS ✓</div>
                    </div>
                    <div className="mock-post-text">When your senior explains in 10 mins what coaching couldn't in 10 months 😭 Drop your toughest Bio question below 👇</div>
                    <div className="mock-post-actions">
                      <span className="mock-action">🔥 1.2k</span>
                      <span className="mock-action">💬 289</span>
                      <span className="mock-action">📌 Save</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="lp-section">
          <div className="hiw">
            <div className="center">
              <div className="section-tag">How it works</div>
              <h2 className="section-title">From confused aspirant<br/>to guided achiever</h2>
              <p className="section-sub center">Three simple steps. Real results. No fluff.</p>
            </div>
            <div className="steps reveal">
              <div className="step">
                <div className="step-num">01</div>
                <div className="step-icon">🎯</div>
                <h3>Tell us your goal</h3>
                <p>JEE, NEET, CAT, or a target college abroad — pick your path and we'll match you with seniors who've been exactly where you are.</p>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <div className="step-icon">🤝</div>
                <h3>Get matched instantly</h3>
                <p>Browse verified seniors from your target institutions. Filter by exam, rank, subject, language, and availability. Chat free, book sessions when you're ready.</p>
              </div>
              <div className="step">
                <div className="step-num">03</div>
                <div className="step-icon">🚀</div>
                <h3>Learn, grow, repeat</h3>
                <p>Scroll the study feed, ask seniors anything, attend live sessions, and track your own progress. Then one day — become a senior yourself.</p>
              </div>
            </div>
          </div>
        </section>

        {/* MENTORS */}
        <section id="mentors" className="lp-section" style={{background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)'}}>
          <div className="mentors-section reveal">
            <div className="center">
              <div className="section-tag">Real Mentors</div>
              <h2 className="section-title">Guidance from those<br/>who actually made it</h2>
              <p className="section-sub center">Every mentor is verified. No coaches, no courses — just real students who cracked it.</p>
            </div>
            <div className="mentor-grid">
              <div className="mentor-card">
                <div className="mc-top">
                  <div className="mc-avatar" style={{background: 'linear-gradient(135deg,#f97316,#ea580c)'}}>A</div>
                  <div>
                    <div className="mc-name">Arjun Sharma</div>
                    <div className="mc-inst">IIT Bombay, 2nd Year</div>
                  </div>
                </div>
                <div className="mc-tags">
                  <span className="mc-tag hot">JEE AIR 247</span>
                  <span className="mc-tag">Maths</span>
                  <span className="mc-tag">Physics</span>
                  <span className="mc-tag">Hindi/English</span>
                </div>
                <div className="mc-stats">
                  <div className="mc-stat"><span className="mc-stat-val">4.9★</span><span className="mc-stat-key">Rating</span></div>
                  <div className="mc-stat"><span className="mc-stat-val">142</span><span className="mc-stat-key">Students</span></div>
                  <div className="mc-stat"><span className="mc-stat-val">Free</span><span className="mc-stat-key">Chat</span></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="flex-1">
                    <HomeConnectButton mentorId="m1" mentorName="Arjun Sharma" hasUser={hasUser} />
                  </div>
                  <Link href="/mentors" className="flex-1 flex items-center justify-center py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/10 transition-colors">
                    View Profile
                  </Link>
                </div>
              </div>
              <div className="mentor-card">
                <div className="mc-top">
                  <div className="mc-avatar" style={{background: 'linear-gradient(135deg,#7c3aed,#6d28d9)'}}>P</div>
                  <div>
                    <div className="mc-name">Priya Nair</div>
                    <div className="mc-inst">AIIMS Delhi, 3rd Year</div>
                  </div>
                </div>
                <div className="mc-tags">
                  <span className="mc-tag hot">NEET 720/720</span>
                  <span className="mc-tag">Biology</span>
                  <span className="mc-tag">Chemistry</span>
                  <span className="mc-tag">English</span>
                </div>
                <div className="mc-stats">
                  <div className="mc-stat"><span className="mc-stat-val">5.0★</span><span className="mc-stat-key">Rating</span></div>
                  <div className="mc-stat"><span className="mc-stat-val">89</span><span className="mc-stat-key">Students</span></div>
                  <div className="mc-stat"><span className="mc-stat-val">Free</span><span className="mc-stat-key">Chat</span></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="flex-1">
                    <HomeConnectButton mentorId="m2" mentorName="Priya Nair" hasUser={hasUser} />
                  </div>
                  <Link href="/mentors" className="flex-1 flex items-center justify-center py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/10 transition-colors">
                    View Profile
                  </Link>
                </div>
              </div>
              <div className="mentor-card">
                <div className="mc-top">
                  <div className="mc-avatar" style={{background: 'linear-gradient(135deg,#0ea5e9,#0284c7)'}}>R</div>
                  <div>
                    <div className="mc-name">Rohan Mehta</div>
                    <div className="mc-inst">IIM Ahmedabad, MBA</div>
                  </div>
                </div>
                <div className="mc-tags">
                  <span className="mc-tag hot">CAT 99.8%ile</span>
                  <span className="mc-tag">DILR</span>
                  <span className="mc-tag">Quant</span>
                  <span className="mc-tag">GD/PI</span>
                </div>
                <div className="mc-stats">
                  <div className="mc-stat"><span className="mc-stat-val">4.8★</span><span className="mc-stat-key">Rating</span></div>
                  <div className="mc-stat"><span className="mc-stat-val">203</span><span className="mc-stat-key">Students</span></div>
                  <div className="mc-stat"><span className="mc-stat-val">Free</span><span className="mc-stat-key">Chat</span></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="flex-1">
                    <HomeConnectButton mentorId="m3" mentorName="Rohan Mehta" hasUser={hasUser} />
                  </div>
                  <Link href="/mentors" className="flex-1 flex items-center justify-center py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/10 transition-colors">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="lp-section">
          <div className="pricing-section reveal">
            <div className="center">
              <div className="section-tag">Pricing</div>
              <h2 className="section-title">Start free. Level up<br/>when you're ready.</h2>
              <p className="section-sub center">No hidden fees. Mentors set their own session rates. Platform takes 20%.</p>
            </div>
            <div className="pricing-grid">
              <div className="price-card">
                <div className="price-name">Free</div>
                <div className="price-amount">₹0<sub>/mo</sub></div>
                <p className="price-desc">Everything you need to start your journey and connect with the community.</p>
                <div className="price-features">
                  <div className="pf"><div className="pf-check">✓</div>Full community feed access</div>
                  <div className="pf"><div className="pf-check">✓</div>Unlimited quick questions</div>
                  <div className="pf"><div className="pf-check">✓</div>Browse all mentor profiles</div>
                  <div className="pf"><div className="pf-check">✓</div>Free chat with mentors</div>
                  <div className="pf"><div className="pf-check muted">—</div><span style={{color: 'var(--muted)'}}>1-on-1 video sessions</span></div>
                  <div className="pf"><div className="pf-check muted">—</div><span style={{color: 'var(--muted)'}}>Priority matching</span></div>
                </div>
                <Link href="/student/signup" className="lp-btn btn-ghost" style={{width: '100%', justifyContent: 'center', padding: '14px', boxSizing: 'border-box'}}>Get Started Free</Link>
              </div>
              <div className="price-card featured">
                <div className="price-badge">Most Popular</div>
                <div className="price-name">Pro</div>
                <div className="price-amount"><sup>₹</sup>299<sub>/mo</sub></div>
                <p className="price-desc">For serious aspirants who want every edge to crack their target exam.</p>
                <div className="price-features">
                  <div className="pf"><div className="pf-check">✓</div>Everything in Free</div>
                  <div className="pf"><div className="pf-check">✓</div>Unlimited 1-on-1 chat</div>
                  <div className="pf"><div className="pf-check">✓</div>Priority mentor matching</div>
                  <div className="pf"><div className="pf-check">✓</div>Session recordings</div>
                  <div className="pf"><div className="pf-check">✓</div>Exclusive study resources</div>
                  <div className="pf"><div className="pf-check">✓</div>Goal tracking dashboard</div>
                </div>
                <Link href="/student/signup" className="lp-btn btn-primary" style={{width: '100%', justifyContent: 'center', padding: '14px', boxSizing: 'border-box'}}>Start Pro — ₹299/mo</Link>
              </div>
              <div className="price-card">
                <div className="price-name">Mentor</div>
                <div className="price-amount">₹0<sub>/setup</sub></div>
                <p className="price-desc">Already cracked it? Help others and earn. Set your own session price.</p>
                <div className="price-features">
                  <div className="pf"><div className="pf-check">✓</div>Verified mentor badge</div>
                  <div className="pf"><div className="pf-check">✓</div>Set your own session rate</div>
                  <div className="pf"><div className="pf-check">✓</div>Keep 80% of earnings</div>
                  <div className="pf"><div className="pf-check">✓</div>Mentor dashboard</div>
                  <div className="pf"><div className="pf-check">✓</div>Build your student base</div>
                  <div className="pf"><div className="pf-check">✓</div>Priority profile ranking</div>
                </div>
                <Link href="/mentor/signup"><button className="lp-btn btn-ghost" style={{width: '100%', justifyContent: 'center', padding: '14px'}}>Become a Mentor</button></Link>
              </div>
            </div>
          </div>
        </section>

        {/* WAITLIST */}
        <section id="waitlist" className="lp-section">
          <div className="waitlist-section reveal">
            <div className="section-tag">Early Access</div>
            <h2 className="section-title">Be first when we launch.</h2>
            <p className="section-sub center">Join 2,400+ students on the waitlist. Early members get 3 months of Pro free.</p>

            <div className="waitlist-box">
              <div className="waitlist-count-wrapper">
                <div className="waitlist-count">🔥 2,412 students already joined</div>
              </div>
              <WaitlistForm />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="nav-logo">Sen<span>jr</span></div>
              <p>Senior to Junior. The global student mentorship community. Built by students, for students.</p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#">Home Feed</a>
              <Link href="/mentors">Find a Senior</Link>
              <Link href="/mentor/signup">Become a Mentor</Link>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-col">
              <h4>Exams</h4>
              <a href="#">JEE Advanced</a>
              <a href="#">NEET</a>
              <a href="#">CAT / MBA</a>
              <a href="#">International</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Senjr. All rights reserved.</span>
            <span>Made with ❤️ for every student grinding it out</span>
            <span>Privacy · Terms</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
