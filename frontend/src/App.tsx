import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, Search, Share2, Mic, ArrowRight, Copy, Download, Check } from 'lucide-react';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const section7Ref = useRef<HTMLDivElement>(null);

  // Hero load animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const heroTl = gsap.timeline({ delay: 0.2 });
      
      heroTl.fromTo('.hero-image', 
        { opacity: 0, scale: 1.06, y: 18 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out' }
      )
      .fromTo('.hero-headline span',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.03, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo('.hero-subheadline',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo('.hero-cta',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo('.hero-ui-card',
        { x: '10vw', opacity: 0, rotate: 1 },
        { x: 0, opacity: 1, rotate: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero scroll animation (exit only)
      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set('.hero-headline, .hero-subheadline, .hero-cta, .hero-image, .hero-ui-card, .nav-container', {
              opacity: 1, x: 0, y: 0, scale: 1
            });
          }
        }
      });

      heroScrollTl.fromTo('.hero-headline',
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo('.hero-subheadline',
        { x: 0, opacity: 1 },
        { x: '-14vw', opacity: 0, ease: 'power2.in' },
        0.72
      )
      .fromTo('.hero-cta',
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power2.in' },
        0.74
      )
      .fromTo('.hero-image',
        { x: 0, scale: 1, opacity: 1 },
        { x: '-10vw', scale: 0.96, opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo('.hero-ui-card',
        { y: 0, opacity: 1 },
        { y: '18vh', opacity: 0, ease: 'power2.in' },
        0.72
      )
      .fromTo('.nav-container',
        { y: 0, opacity: 1 },
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.75
      );

      // Section 2: Instant Transcription
      const section2Tl = gsap.timeline({
        scrollTrigger: {
          trigger: section2Ref.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      section2Tl.fromTo('.s2-image',
        { y: '-40vh', opacity: 0, scale: 1.04 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo('.s2-headline',
        { x: '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      )
      .fromTo('.s2-body',
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      )
      .fromTo('.s2-ui-card',
        { x: '55vw', opacity: 0, rotate: -2 },
        { x: 0, opacity: 1, rotate: 0, ease: 'none' },
        0.1
      )
      .fromTo('.s2-image',
        { y: 0, opacity: 1 },
        { y: '-18vh', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo('.s2-headline',
        { y: 0, opacity: 1 },
        { y: '16vh', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo('.s2-body',
        { y: 0, opacity: 1 },
        { y: '8vh', opacity: 0, ease: 'power2.in' },
        0.72
      )
      .fromTo('.s2-ui-card',
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.72
      );

      // Section 3: Highlight & Extract
      const section3Tl = gsap.timeline({
        scrollTrigger: {
          trigger: section3Ref.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      section3Tl.fromTo('.s3-image',
        { x: '60vw', opacity: 0, scale: 1.05 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo('.s3-headline',
        { y: '-30vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      )
      .fromTo('.s3-body',
        { x: '-20vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      )
      .fromTo('.s3-cta',
        { x: '-20vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.12
      )
      .fromTo('.s3-ui-card',
        { y: '60vh', opacity: 0, rotate: 2 },
        { y: 0, opacity: 1, rotate: 0, ease: 'none' },
        0.12
      )
      .fromTo('.s3-image',
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo('.s3-headline',
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo('.s3-body, .s3-cta',
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.72
      )
      .fromTo('.s3-ui-card',
        { y: 0, opacity: 1 },
        { y: '22vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      // Section 4: Organize & Search
      const section4Tl = gsap.timeline({
        scrollTrigger: {
          trigger: section4Ref.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      section4Tl.fromTo('.s4-image',
        { y: '-45vh', opacity: 0, scale: 1.06 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo('.s4-headline',
        { x: '-55vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      )
      .fromTo('.s4-body',
        { y: '12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      )
      .fromTo('.s4-ui-card',
        { x: '55vw', opacity: 0, rotate: -2 },
        { x: 0, opacity: 1, rotate: 0, ease: 'none' },
        0.1
      )
      .fromTo('.s4-image',
        { y: 0, opacity: 1 },
        { y: '-16vh', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo('.s4-headline',
        { y: 0, opacity: 1 },
        { y: '14vh', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo('.s4-body',
        { y: 0, opacity: 1 },
        { y: '8vh', opacity: 0, ease: 'power2.in' },
        0.72
      )
      .fromTo('.s4-ui-card',
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.72
      );

      // Section 5: Share Anywhere
      const section5Tl = gsap.timeline({
        scrollTrigger: {
          trigger: section5Ref.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      section5Tl.fromTo('.s5-image',
        { x: '60vw', opacity: 0, scale: 1.05 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo('.s5-headline',
        { y: '-30vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      )
      .fromTo('.s5-body',
        { x: '-20vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      )
      .fromTo('.s5-cta',
        { x: '-20vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.12
      )
      .fromTo('.s5-ui-card',
        { y: '60vh', opacity: 0, rotate: 2 },
        { y: 0, opacity: 1, rotate: 0, ease: 'none' },
        0.12
      )
      .fromTo('.s5-image',
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo('.s5-headline',
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo('.s5-body, .s5-cta',
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.72
      )
      .fromTo('.s5-ui-card',
        { y: 0, opacity: 1 },
        { y: '22vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      // Section 6: For Every Voice
      const section6Tl = gsap.timeline({
        scrollTrigger: {
          trigger: section6Ref.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      section6Tl.fromTo('.s6-image',
        { scale: 0.86, opacity: 0, y: '10vh' },
        { scale: 1, opacity: 1, y: 0, ease: 'none' },
        0
      )
      .fromTo('.s6-headline',
        { x: '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      )
      .fromTo('.s6-body',
        { y: '14vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      )
      .fromTo('.s6-cta',
        { y: '14vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
      )
      .fromTo('.s6-ui-card',
        { x: '30vw', opacity: 0, rotate: -2 },
        { x: 0, opacity: 1, rotate: 0, ease: 'none' },
        0.12
      )
      .fromTo('.s6-image',
        { scale: 1, opacity: 1 },
        { scale: 1.05, opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo('.s6-headline',
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo('.s6-body, .s6-cta',
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.72
      )
      .fromTo('.s6-ui-card',
        { y: 0, opacity: 1 },
        { y: '18vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      // Section 7: Get Started (flowing, not pinned)
      gsap.fromTo('.s7-image',
        { y: '-12vh', opacity: 0, scale: 1.04 },
        {
          y: 0, opacity: 1, scale: 1,
          scrollTrigger: {
            trigger: section7Ref.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.6,
          }
        }
      );

      gsap.fromTo('.s7-headline',
        { x: '-18vw', opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: section7Ref.current,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 0.6,
          }
        }
      );

      gsap.fromTo('.s7-body, .s7-cta-group',
        { y: '8vh', opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section7Ref.current,
            start: 'top 60%',
            end: 'top 30%',
            scrub: 0.6,
          }
        }
      );

      gsap.fromTo('.s7-footer',
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: '.s7-footer',
            start: 'top 90%',
            end: 'top 70%',
            scrub: 0.6,
          }
        }
      );

      // Global snap for pinned sections
      const pinned = ScrollTrigger.getAll().filter(st => st.vars.pin).sort((a, b) => a.start - b.start);
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (maxScroll && pinned.length > 0) {
        const pinnedRanges = pinned.map(st => ({
          start: st.start / maxScroll,
          end: (st.end ?? st.start) / maxScroll,
          center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
        }));

        ScrollTrigger.create({
          snap: {
            snapTo: (value: number) => {
              const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
              if (!inPinned) return value;
              
              const target = pinnedRanges.reduce((closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
                pinnedRanges[0]?.center ?? 0
              );
              return target;
            },
            duration: { min: 0.15, max: 0.35 },
            delay: 0,
            ease: 'power2.out',
          }
        });
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <nav className="nav-container fixed top-0 left-0 right-0 z-[100] px-[6vw] py-6 flex items-center justify-between">
        <div className="font-heading font-bold text-lg tracking-tight text-dark">
          RhemaFlows
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="link-underline text-sm font-medium text-dark/80 hover:text-dark transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="link-underline text-sm font-medium text-dark/80 hover:text-dark transition-colors">
            How it works
          </a>
          <a href="#pricing" className="link-underline text-sm font-medium text-dark/80 hover:text-dark transition-colors">
            Pricing
          </a>
          <a href="#signin" className="link-underline text-sm font-medium text-dark/80 hover:text-dark transition-colors">
            Sign in
          </a>
          <button className="btn-hover bg-lime text-dark font-semibold text-sm px-5 py-2.5 rounded-full">
            Start free
          </button>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section ref={heroRef} className="section-pinned bg-offwhite z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/hero_upload.jpg" 
            alt="Upload and transcribe" 
            className="hero-image w-[62vw] h-[56vh] object-cover"
            style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%, -50%)' }}
          />
        </div>

        <div 
          className="hero-headline absolute"
          style={{ left: '6vw', top: '14vh', width: '40vw' }}
        >
          <h1 className="font-heading font-black text-dark uppercase tracking-tight leading-[0.95]"
              style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}>
            <span className="inline-block">UPLOAD</span>{' '}
            <span className="inline-block">&</span>{' '}
            <span className="inline-block">TRANSCRIBE</span>
          </h1>
        </div>

        <p 
          className="hero-subheadline absolute text-text-secondary font-medium leading-relaxed"
          style={{ left: '6vw', top: '30vh', width: '34vw', fontSize: 'clamp(14px, 1.1vw, 16px)' }}
        >
          Turn sermons and teachings into searchable text in minutes.
        </p>

        <button 
          className="hero-cta btn-hover absolute bg-lime text-dark font-semibold px-8 py-3.5 rounded-full flex items-center gap-2"
          style={{ left: '6vw', top: '38vh' }}
        >
          Start free
          <ArrowRight className="w-4 h-4" />
        </button>

        <div 
          className="hero-ui-card ui-card absolute bg-white rounded-2xl p-6"
          style={{ right: '6vw', bottom: '10vh', width: '22vw', minWidth: '260px' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-lime/20 rounded-xl flex items-center justify-center">
              <Upload className="w-5 h-5 text-dark" />
            </div>
            <span className="font-semibold text-dark text-sm">Drop an audio file</span>
          </div>
          <p className="text-text-secondary text-xs">MP3, M4A, WAV - Up to 2 hours</p>
        </div>
      </section>

      {/* Section 2: Instant Transcription */}
      <section ref={section2Ref} id="features" className="section-pinned bg-offwhite z-20">
        <img 
          src="/img_transcript.jpg" 
          alt="Instant transcription" 
          className="s2-image absolute object-cover"
          style={{ left: '50%', top: '18vh', transform: 'translateX(-50%)', width: '76vw', height: '34vh' }}
        />

        <h2 
          className="s2-headline absolute font-heading font-black text-dark uppercase tracking-tight leading-[0.95]"
          style={{ left: '6vw', bottom: '24vh', width: '46vw', fontSize: 'clamp(32px, 5vw, 68px)' }}
        >
          INSTANT TRANSCRIPTION
        </h2>

        <p 
          className="s2-body absolute text-text-secondary font-medium leading-relaxed"
          style={{ left: '6vw', bottom: '14vh', width: '34vw', fontSize: 'clamp(14px, 1.1vw, 16px)' }}
        >
          Speaker-aware paragraphs, punctuation, and timestamps—ready to edit.
        </p>

        <div 
          className="s2-ui-card ui-card absolute bg-white rounded-2xl p-5"
          style={{ right: '6vw', bottom: '14vh', width: '24vw', minWidth: '280px' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Transcript ready</span>
            <Check className="w-4 h-4 text-lime" />
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-100 rounded-full w-full" />
            <div className="h-2 bg-gray-100 rounded-full w-[85%]" />
            <div className="h-2 bg-gray-100 rounded-full w-[70%]" />
          </div>
        </div>
      </section>

      {/* Section 3: Highlight & Extract */}
      <section ref={section3Ref} id="how-it-works" className="section-pinned bg-offwhite z-30">
        <img 
          src="/img_highlight.jpg" 
          alt="Highlight and extract" 
          className="s3-image absolute object-cover"
          style={{ right: '6vw', top: '50%', transform: 'translateY(-50%)', width: '46vw', height: '64vh' }}
        />

        <h2 
          className="s3-headline absolute font-heading font-black text-dark uppercase tracking-tight leading-[0.95]"
          style={{ left: '6vw', top: '14vh', width: '40vw', fontSize: 'clamp(32px, 5vw, 68px)' }}
        >
          HIGHLIGHT & EXTRACT
        </h2>

        <p 
          className="s3-body absolute text-text-secondary font-medium leading-relaxed"
          style={{ left: '6vw', top: '28vh', width: '34vw', fontSize: 'clamp(14px, 1.1vw, 16px)' }}
        >
          Select any line to create a beautiful, shareable quote—instantly.
        </p>

        <button 
          className="s3-cta btn-hover absolute text-dark font-semibold text-sm flex items-center gap-2 link-underline"
          style={{ left: '6vw', top: '38vh' }}
        >
          See how it works
          <ArrowRight className="w-4 h-4" />
        </button>

        <div 
          className="s3-ui-card ui-card absolute bg-white rounded-2xl p-5 border-l-4 border-lime"
          style={{ left: '6vw', bottom: '12vh', width: '22vw', minWidth: '260px' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">Quote card preview</p>
          <div className="bg-offwhite rounded-xl p-4">
            <p className="text-dark text-sm font-medium leading-relaxed">
              "The words we speak today become the foundation of tomorrow's faith."
            </p>
            <p className="text-text-secondary text-xs mt-2">— Pastor John, Sunday Service</p>
          </div>
        </div>
      </section>

      {/* Section 4: Organize & Search */}
      <section ref={section4Ref} className="section-pinned bg-offwhite z-40">
        <img 
          src="/img_library.jpg" 
          alt="Organize and search" 
          className="s4-image absolute object-cover"
          style={{ left: '50%', top: '18vh', transform: 'translateX(-50%)', width: '78vw', height: '36vh' }}
        />

        <h2 
          className="s4-headline absolute font-heading font-black text-dark uppercase tracking-tight leading-[0.95]"
          style={{ left: '6vw', bottom: '24vh', width: '46vw', fontSize: 'clamp(32px, 5vw, 68px)' }}
        >
          ORGANIZE & SEARCH
        </h2>

        <p 
          className="s4-body absolute text-text-secondary font-medium leading-relaxed"
          style={{ left: '6vw', bottom: '14vh', width: '34vw', fontSize: 'clamp(14px, 1.1vw, 16px)' }}
        >
          Build a searchable library of teachings. Find any quote in seconds.
        </p>

        <div 
          className="s4-ui-card ui-card absolute bg-white rounded-2xl p-5"
          style={{ right: '6vw', bottom: '14vh', width: '24vw', minWidth: '280px' }}
        >
          <div className="flex items-center gap-2 bg-offwhite rounded-xl px-4 py-3 mb-4">
            <Search className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">Search quotes...</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-lime/20 text-dark text-xs font-medium rounded-full">#faith</span>
            <span className="px-3 py-1.5 bg-offwhite text-dark text-xs font-medium rounded-full">#hope</span>
            <span className="px-3 py-1.5 bg-offwhite text-dark text-xs font-medium rounded-full">#love</span>
          </div>
        </div>
      </section>

      {/* Section 5: Share Anywhere */}
      <section ref={section5Ref} className="section-pinned bg-offwhite z-50">
        <img 
          src="/img_share.jpg" 
          alt="Share anywhere" 
          className="s5-image absolute object-cover"
          style={{ right: '6vw', top: '50%', transform: 'translateY(-50%)', width: '46vw', height: '64vh' }}
        />

        <h2 
          className="s5-headline absolute font-heading font-black text-dark uppercase tracking-tight leading-[0.95]"
          style={{ left: '6vw', top: '14vh', width: '40vw', fontSize: 'clamp(32px, 5vw, 68px)' }}
        >
          SHARE ANYWHERE
        </h2>

        <p 
          className="s5-body absolute text-text-secondary font-medium leading-relaxed"
          style={{ left: '6vw', top: '28vh', width: '34vw', fontSize: 'clamp(14px, 1.1vw, 16px)' }}
        >
          Export quote cards, clips, or full transcripts—formatted for your workflow.
        </p>

        <button 
          className="s5-cta btn-hover absolute text-dark font-semibold text-sm flex items-center gap-2 link-underline"
          style={{ left: '6vw', top: '40vh' }}
        >
          View export options
          <ArrowRight className="w-4 h-4" />
        </button>

        <div 
          className="s5-ui-card ui-card absolute bg-white rounded-2xl p-5"
          style={{ left: '6vw', bottom: '12vh', width: '22vw', minWidth: '260px' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">Export</p>
          <div className="flex gap-3">
            <button className="flex-1 flex flex-col items-center gap-2 p-3 bg-offwhite rounded-xl hover:bg-lime/20 transition-colors">
              <Copy className="w-5 h-5 text-dark" />
              <span className="text-xs font-medium text-dark">Copy</span>
            </button>
            <button className="flex-1 flex flex-col items-center gap-2 p-3 bg-offwhite rounded-xl hover:bg-lime/20 transition-colors">
              <Download className="w-5 h-5 text-dark" />
              <span className="text-xs font-medium text-dark">Download</span>
            </button>
            <button className="flex-1 flex flex-col items-center gap-2 p-3 bg-offwhite rounded-xl hover:bg-lime/20 transition-colors">
              <Share2 className="w-5 h-5 text-dark" />
              <span className="text-xs font-medium text-dark">Share</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 6: For Every Voice */}
      <section ref={section6Ref} className="section-pinned bg-offwhite z-[60]">
        <img 
          src="/img_everyvoice.jpg" 
          alt="For every voice" 
          className="s6-image absolute object-cover"
          style={{ left: '50%', top: '52%', transform: 'translate(-50%, -50%)', width: '62vw', height: '56vh' }}
        />

        <h2 
          className="s6-headline absolute font-heading font-black text-dark uppercase tracking-tight leading-[0.95]"
          style={{ left: '6vw', top: '14vh', width: '40vw', fontSize: 'clamp(32px, 5vw, 68px)' }}
        >
          FOR EVERY VOICE
        </h2>

        <p 
          className="s6-body absolute text-text-secondary font-medium leading-relaxed"
          style={{ left: '6vw', top: '28vh', width: '34vw', fontSize: 'clamp(14px, 1.1vw, 16px)' }}
        >
          From the pulpit to the classroom—capture insight without missing a word.
        </p>

        <button 
          className="s6-cta btn-hover absolute text-dark font-semibold text-sm flex items-center gap-2 link-underline"
          style={{ left: '6vw', top: '40vh' }}
        >
          Explore use cases
          <ArrowRight className="w-4 h-4" />
        </button>

        <div 
          className="s6-ui-card ui-card absolute bg-white rounded-2xl p-5"
          style={{ right: '6vw', bottom: '10vh', width: '22vw', minWidth: '260px' }}
        >
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-lime text-dark text-sm font-semibold rounded-full flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Sermons
            </span>
            <span className="px-4 py-2 bg-offwhite text-dark text-sm font-medium rounded-full">Lectures</span>
            <span className="px-4 py-2 bg-offwhite text-dark text-sm font-medium rounded-full">Podcasts</span>
          </div>
        </div>
      </section>

      {/* Section 7: Get Started (Closing) */}
      <section ref={section7Ref} id="pricing" className="relative bg-dark min-h-screen z-[70]">
        <img 
          src="/img_close.jpg" 
          alt="Get started" 
          className="s7-image absolute object-cover opacity-80"
          style={{ left: '50%', top: '18vh', transform: 'translateX(-50%)', width: '78vw', height: '36vh' }}
        />

        <h2 
          className="s7-headline absolute font-heading font-black text-offwhite uppercase tracking-tight leading-[0.95]"
          style={{ left: '6vw', bottom: '28vh', width: '46vw', fontSize: 'clamp(32px, 5vw, 68px)' }}
        >
          GET STARTED
        </h2>

        <p 
          className="s7-body absolute text-offwhite/70 font-medium leading-relaxed"
          style={{ left: '6vw', bottom: '18vh', width: '34vw', fontSize: 'clamp(14px, 1.1vw, 16px)' }}
        >
          Upload your first sermon. Extract your first quote. Share what matters.
        </p>

        <div 
          className="s7-cta-group absolute flex items-center gap-6"
          style={{ left: '6vw', bottom: '10vh' }}
        >
          <button className="btn-hover bg-lime text-dark font-semibold px-8 py-3.5 rounded-full flex items-center gap-2">
            Start free
            <ArrowRight className="w-4 h-4" />
          </button>
          <a href="#" className="link-underline text-offwhite/80 font-medium text-sm hover:text-offwhite transition-colors">
            View pricing
          </a>
        </div>

        {/* Footer */}
        <footer className="s7-footer absolute bottom-0 left-0 right-0 px-[6vw] py-8 border-t border-offwhite/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="font-heading font-bold text-offwhite text-sm">RhemaFlows</span>
              <span className="text-offwhite/50 text-xs">Transcription storage is encrypted. You own your content.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-offwhite/50 text-xs hover:text-offwhite transition-colors">Privacy</a>
              <a href="#" className="text-offwhite/50 text-xs hover:text-offwhite transition-colors">Terms</a>
              <a href="#" className="text-offwhite/50 text-xs hover:text-offwhite transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default App;
