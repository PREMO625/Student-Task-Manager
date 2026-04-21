'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, BarChart3, Calendar, Shield, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

const features = [
  { icon: CheckCircle2, title: 'Smart Task Management', desc: 'Create, organize, and track assignments with priority levels and deadlines.' },
  { icon: BarChart3, title: 'Insightful Analytics', desc: 'Visualize your productivity with charts, streaks, and completion rates.' },
  { icon: Calendar, title: 'Deadline Tracking', desc: 'Never miss a due date with calendar views and upcoming deadline alerts.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and protected with enterprise-grade security.' },
];

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}><Zap size={18} /></div>
            <span>TaskFlow</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/login" className="btn-ghost">Log In</Link>
            <Link href="/register" className="btn-primary">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className={styles.heroBadge}>
            <Zap size={14} />
            <span>Built for Students</span>
          </div>
          <h1 className={styles.heroTitle}>
            Master Your <span className={styles.gradient}>Academic Life</span>
          </h1>
          <p className={styles.heroDesc}>
            Organize assignments, crush deadlines, and track your productivity. TaskFlow is the modern task manager that keeps you focused and ahead.
          </p>
          <div className={styles.heroCta}>
            <Link href="/register" className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
              Start Free <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-secondary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Floating orbs */}
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </section>

      {/* Features */}
      <section className={styles.features}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Everything You Need to <span className={styles.gradient}>Succeed</span>
        </motion.h2>
        <div className={styles.featureGrid}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className={styles.featureIcon}>
                <f.icon size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <motion.div
          className={styles.ctaCard}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Ready to Take Control?</h2>
          <p>Join students who are already crushing their goals with TaskFlow.</p>
          <Link href="/register" className="btn-primary" style={{ padding: '14px 40px', fontSize: '1rem' }}>
            Get Started Now <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 TaskFlow. Built with ❤️ for students.</p>
      </footer>
    </div>
  );
}
