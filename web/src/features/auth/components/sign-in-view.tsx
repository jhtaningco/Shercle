'use client';

import { useState } from 'react';
import UserAuthForm from '@/features/auth/components/user-auth-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SignInViewPage() {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4 lg:p-8 relative'>
      <div className='flex w-full max-w-[400px] flex-col justify-center space-y-6'>
        <div className="flex flex-col items-center space-y-2 text-center">
          <img
            src="/assets/logos/logo-main.png"
            alt="Shercle Logo"
            className="h-16 w-auto mb-4 drop-shadow-sm"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Shercle
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in
          </p>
        </div>

        <UserAuthForm />

        <p className='text-muted-foreground px-8 text-center text-sm mt-8'>
          By clicking continue, you agree to our{' '}
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className='hover:text-primary underline underline-offset-4 cursor-pointer'
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={() => setPrivacyOpen(true)}
            className='hover:text-primary underline underline-offset-4 cursor-pointer'
          >
            Data Privacy Policy
          </button>
          .
        </p>
      </div>

      {/* Terms of Service Dialog */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">Terms of Service</DialogTitle>
            <DialogDescription>
              Please read our Terms of Service carefully before using Shercle.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <section>
                <h3 className="font-semibold text-foreground mb-1">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using the Shercle platform, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service. If you do not agree
                  to these terms, you must not use the platform.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">2. Description of Service</h3>
                <p>
                  Shercle is an e-governance platform designed to facilitate communication between
                  citizens and local government units, including but not limited to incident
                  reporting, SOS alerts, complaint management, and access to public safety services
                  provided by CSWD and CDRRMO.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">3. User Accounts</h3>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials
                  and for all activities that occur under your account. You agree to notify the
                  platform administrators immediately of any unauthorized use of your account.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">4. User Conduct</h3>
                <p>
                  You agree not to misuse the platform, including but not limited to: submitting
                  false reports or SOS alerts, harassing other users, attempting to gain unauthorized
                  access to other accounts or systems, or using the platform for any unlawful purpose.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">5. Intellectual Property</h3>
                <p>
                  All content, features, and functionality of the Shercle platform, including but
                  not limited to text, graphics, logos, and software, are the property of the
                  platform operators and are protected by applicable intellectual property laws.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">6. Limitation of Liability</h3>
                <p>
                  The platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not
                  guarantee uninterrupted or error-free operation. In no event shall the platform
                  operators be liable for any indirect, incidental, or consequential damages arising
                  from your use of the service.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">7. Modifications to Terms</h3>
                <p>
                  We reserve the right to modify these Terms of Service at any time. Continued use
                  of the platform after changes are posted constitutes your acceptance of the
                  revised terms.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">8. Governing Law</h3>
                <p>
                  These Terms of Service shall be governed by and construed in accordance with the
                  laws of the Republic of the Philippines.
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Data Privacy Policy Dialog */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">Data Privacy Policy</DialogTitle>
            <DialogDescription>
              Learn how Shercle collects, uses, and protects your personal information.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <section>
                <h3 className="font-semibold text-foreground mb-1">1. Information We Collect</h3>
                <p>
                  We collect personal information that you provide when creating an account,
                  submitting reports, or using our services. This may include your name, email
                  address, contact number, location data, and any information included in your
                  reports or messages.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">2. How We Use Your Information</h3>
                <p>
                  Your information is used to provide and improve our services, process incident
                  reports and SOS alerts, facilitate communication between citizens and local
                  government units, generate anonymized analytics for public safety planning, and
                  comply with legal obligations.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">3. Data Sharing and Disclosure</h3>
                <p>
                  We may share your information with authorized local government personnel (CSWD,
                  CDRRMO, Barangay Officials) for the purpose of responding to your reports and
                  requests. We do not sell or rent your personal information to third parties.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">4. Data Security</h3>
                <p>
                  We implement reasonable technical and organizational measures to protect your
                  personal information against unauthorized access, alteration, disclosure, or
                  destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">5. Data Retention</h3>
                <p>
                  We retain your personal information for as long as your account is active or as
                  needed to provide services, comply with legal obligations, resolve disputes, and
                  enforce our agreements.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">6. Your Rights</h3>
                <p>
                  In accordance with the Data Privacy Act of 2012 (Republic Act No. 10173), you
                  have the right to access, correct, and delete your personal information. You may
                  also object to the processing of your data or request data portability by
                  contacting our Data Protection Officer.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">7. Cookies and Tracking</h3>
                <p>
                  The platform may use cookies and similar technologies to enhance your experience,
                  analyze usage patterns, and improve our services. You may configure your browser
                  to reject cookies, though some features may not function properly.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">8. Children&apos;s Privacy</h3>
                <p>
                  The platform is not intended for use by children under the age of 13. We do not
                  knowingly collect personal information from children under 13. If we become aware
                  of such collection, we will take steps to delete the information.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">9. Changes to This Policy</h3>
                <p>
                  We may update this Data Privacy Policy from time to time. We will notify users of
                  significant changes through the platform. Continued use after updates constitutes
                  acceptance of the revised policy.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-foreground mb-1">10. Contact Us</h3>
                <p>
                  If you have any questions or concerns about this Data Privacy Policy or our data
                  practices, please contact our Data Protection Officer through the platform&apos;s
                  official channels.
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
