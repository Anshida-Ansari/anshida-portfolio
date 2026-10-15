import React, { useState } from 'react';
import { ArrowUpRight, Copy, Check, FileDown } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './Icons';
import './Contact.css';

const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = 'anshidaansari9a@gmail.com';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="section section-border contact" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact__inner">
          {/* Main Huge Typography Headline */}
          <div className="contact__headline-wrap reveal">
            <span className="eyebrow">Get in touch</span>
            <h2 id="contact-heading" className="contact__headline">
              HAVE A PROJECT<br />
              <span className="contact__headline--outline">OR ROLE IN MIND?</span>
            </h2>
            <p className="contact__subhead">
              I am open to full-time developer roles, high-impact MERN stack contracts, and discussions with founders building ambitious digital products.
            </p>
          </div>

          {/* Contact Direct Actions Grid */}
          <div className="contact__grid reveal reveal-delay-1">
            {/* Direct Email Card */}
            <div className="contact-card contact-card--primary">
              <div className="contact-card__top">
                <span className="eyebrow">Direct Inquiries</span>
                <button
                  type="button"
                  className="contact-card__copy-btn"
                  onClick={handleCopyEmail}
                  title="Copy email to clipboard"
                  id="contact-copy-email-btn"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="contact-card__copy-icon--active" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={`mailto:${email}`}
                className="contact-card__email-link"
                id="contact-email-link"
              >
                <span className="contact-card__email-text">{email}</span>
                <ArrowUpRight size={22} className="contact-card__arrow" />
              </a>
              <span className="contact-card__hint">Click to launch email client · Usually responds within 24h</span>
            </div>

            {/* Social & Resume Links */}
            <div className="contact-links-grid">
              <a
                href="https://www.linkedin.com/in/anshida-ansari/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-row"
                id="contact-linkedin-link"
              >
                <div className="contact-link-row__left">
                  <LinkedInIcon size={20} />
                  <div>
                    <span className="contact-link-row__title">LinkedIn</span>
                    <span className="contact-link-row__meta">in/anshida-ansari</span>
                  </div>
                </div>
                <ArrowUpRight size={18} className="contact-link-row__arrow" />
              </a>

              <a
                href="https://github.com/Anshida-Ansari"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-row"
                id="contact-github-link"
              >
                <div className="contact-link-row__left">
                  <GitHubIcon size={20} />
                  <div>
                    <span className="contact-link-row__title">GitHub</span>
                    <span className="contact-link-row__meta">github.com/Anshida-Ansari</span>
                  </div>
                </div>
                <ArrowUpRight size={18} className="contact-link-row__arrow" />
              </a>

              <a
                href="https://drive.google.com/file/d/14R_yvQ-03q2yqD0Z525b6oF34K561Yf6/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-row"
                id="contact-resume-link"
              >
                <div className="contact-link-row__left">
                  <FileDown size={20} />
                  <div>
                    <span className="contact-link-row__title">Curriculum Vitae</span>
                    <span className="contact-link-row__meta">PDF Resume · Google Drive</span>
                  </div>
                </div>
                <ArrowUpRight size={18} className="contact-link-row__arrow" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
