import { mobileRoutes } from "src/application/routes";
import {
  LegalDefinitionList,
  LegalH5,
  LegalH6,
  LegalLink,
  LegalP,
  LegalSection,
  legalContactPath,
} from "src/components/legal/LegalTypography";

export const TermsAndConditionsBody = () => (
  <>
    <LegalP>
      Please read these terms and conditions carefully before using Our
      Service.
    </LegalP>

    <LegalSection>
      <LegalH5>Interpretation and Definitions</LegalH5>
      <LegalH6>Interpretation</LegalH6>
      <LegalP>
        The words of which the initial letter is capitalized have meanings
        defined under the following conditions. The following definitions shall
        have the same meaning regardless of whether they appear in singular or
        in plural.
      </LegalP>
      <LegalH6>Definitions</LegalH6>
      <LegalDefinitionList
        items={[
          { term: "Country", description: "refers to: Switzerland" },
          {
            term: "Company",
            description:
              "(referred to as either 'the Company', 'We', 'Us' or 'Our' in this Agreement) refers to TalePod.",
          },
          {
            term: "Device",
            description:
              "means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
          },
          { term: "Service", description: "refers to the Website." },
          {
            term: "Terms and Conditions",
            description:
              "(also referred as 'Terms') mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.",
          },
          {
            term: "Third-party Social Media Service",
            description:
              "means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.",
          },
          {
            term: "Website",
            description: "refers to TalePod, accessible from www.talepod.com",
          },
          {
            term: "You",
            description:
              "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
          },
        ]}
      />
    </LegalSection>

    <LegalSection>
      <LegalH5>Acknowledgment</LegalH5>
      <LegalP>
        These are the Terms and Conditions governing the use of this Service and
        the agreement that operates between You and the Company. These Terms
        and Conditions set out the rights and obligations of all users regarding
        the use of the Service.
      </LegalP>
      <LegalP>
        Your access to and use of the Service is conditioned on Your acceptance
        of and compliance with these Terms and Conditions. These Terms and
        Conditions apply to all visitors, users and others who access or use the
        Service.
      </LegalP>
      <LegalP>
        By accessing or using the Service You agree to be bound by these Terms
        and Conditions. If You disagree with any part of these Terms and
        Conditions then You may not access the Service.
      </LegalP>
      <LegalP>
        Your access to and use of the Service is also conditioned on Your
        acceptance of and compliance with the{" "}
        <LegalLink screen={mobileRoutes.public.privacyPolicy}>
          Privacy Policy
        </LegalLink>{" "}
        of the Company. Our Privacy Policy describes Our policies and procedures
        on the collection, use and disclosure of Your personal information when
        You use the Application or the Website and tells You about Your privacy
        rights and how the law protects You. Please read Our Privacy Policy
        carefully before using Our Service.
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>Sharing personal information</LegalH5>
      <LegalP>
        Talepod uses personal information according to the Terms of Service and
        this{" "}
        <LegalLink screen={mobileRoutes.public.privacyPolicy}>
          Privacy Policy
        </LegalLink>
        . Talepod may disclose your personal information to third parties,
        including marketing, advertising and analytics providers.
      </LegalP>
      <LegalP>
        We may also disclose information or allow third parties to directly
        collect information using third party cookies and related tracking
        technologies (such as pixels and web beacons) via our website, such as
        social media companies, advertising networks, companies that provide
        analytics (including ad tracking and reporting), security providers and
        others that help us to deliver our services.
      </LegalP>
      <LegalP>
        We only employ such third party tools based on your consent, opt-out
        preferences, or other appropriate legal requirements mandated by
        applicable laws and regulations.
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>Links to Other Websites</LegalH5>
      <LegalP>
        Our Service may contain links to third-party web sites or services that
        are not owned or controlled by the Company.
      </LegalP>
      <LegalP>
        The Company has no control over, and assumes no responsibility for, the
        content, privacy policies, or practices of any third party web sites or
        services. You further acknowledge and agree that the Company shall not
        be responsible or liable, directly or indirectly, for any damage or
        loss caused or alleged to be caused by or in connection with the use of
        or reliance on any such content, goods or services available on or
        through any such web sites or services.
      </LegalP>
      <LegalP>
        We strongly advise You to read the terms and conditions and privacy
        policies of any third-party web sites or services that You visit.
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>Termination</LegalH5>
      <LegalP>
        We may terminate or suspend Your access immediately, without prior
        notice or liability, for any reason whatsoever, including without
        limitation if You breach these Terms and Conditions.
      </LegalP>
      <LegalP>
        Upon termination, Your right to use the Service will cease immediately.
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>Limitation of Liability</LegalH5>
      <LegalP>
        Notwithstanding any damages that You might incur, the entire liability
        of the Company and any of its suppliers under any provision of this
        Terms and Your exclusive remedy for all of the foregoing shall be
        limited to the amount actually paid by You through the Service or 100
        USD if You haven't purchased anything through the Service.
      </LegalP>
      <LegalP>
        To the maximum extent permitted by applicable law, in no event shall
        the Company or its suppliers be liable for any special, incidental,
        indirect, or consequential damages whatsoever (including, but not
        limited to, damages for loss of profits, loss of data or other
        information, for business interruption, for personal injury, loss of
        privacy arising out of or in any way related to the use of or inability
        to use the Service, third-party software and/or third-party hardware
        used with the Service, or otherwise in connection with any provision of
        this Terms), even if the Company or any supplier has been advised of the
        possibility of such damages and even if the remedy fails of its
        essential purpose.
      </LegalP>
      <LegalP>
        Some states do not allow the exclusion of implied warranties or
        limitation of liability for incidental or consequential damages, which
        means that some of the above limitations may not apply. In these states,
        each party's liability will be limited to the greatest extent permitted
        by law.
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>"AS IS" and "AS AVAILABLE" Disclaimer</LegalH5>
      <LegalP>
        The Service is provided to You "AS IS" and "AS AVAILABLE" and with all
        faults and defects without warranty of any kind. To the maximum extent
        permitted under applicable law, the Company, on its own behalf and on
        behalf of its Affiliates and its and their respective licensors and
        service providers, expressly disclaims all warranties, whether express,
        implied, statutory or otherwise, with respect to the Service,
        including all implied warranties of merchantability, fitness for a
        particular purpose, title and non-infringement, and warranties that may
        arise out of course of dealing, course of performance, usage or trade
        practice. Without limitation to the foregoing, the Company provides no
        warranty or undertaking, and makes no representation of any kind that
        the Service will meet Your requirements, achieve any intended results,
        be compatible or work with any other software, applications, systems or
        services, operate without interruption, meet any performance or
        reliability standards or be error free or that any errors or defects
        can or will be corrected.
      </LegalP>
      <LegalP>
        Without limiting the foregoing, neither the Company nor any of the
        company's provider makes any representation or warranty of any kind,
        express or implied: (i) as to the operation or availability of the
        Service, or the information, content, and materials or products
        included thereon; (ii) that the Service will be uninterrupted or
        error-free; (iii) as to the accuracy, reliability, or currency of any
        information or content provided through the Service; or (iv) that the
        Service, its servers, the content, or e-mails sent from or on behalf of
        the Company are free of viruses, scripts, trojan horses, worms,
        malware, timebombs or other harmful components.
      </LegalP>
      <LegalP>
        Some jurisdictions do not allow the exclusion of certain types of
        warranties or limitations on applicable statutory rights of a consumer,
        so some or all of the above exclusions and limitations may not apply to
        You. But in such a case the exclusions and limitations set forth in this
        section shall be applied to the greatest extent enforceable under
        applicable law.
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>Governing Law</LegalH5>
      <LegalP>
        The laws of the Country, excluding its conflicts of law rules, shall
        govern this Terms and Your use of the Service. Your use of the
        Application may also be subject to other local, state, national, or
        international laws.
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>Disputes Resolution</LegalH5>
      <LegalP>
        If You have any concern or dispute about the Service, You agree to
        first try to resolve the dispute informally by{" "}
        <LegalLink screen={mobileRoutes.public.contact}>
          contacting the Company
        </LegalLink>
        .
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>For European Union (EU) Users</LegalH5>
      <LegalP>
        If You are a European Union consumer, you will benefit from any mandatory
        provisions of the law of the country in which You are resident.
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>United States Legal Compliance</LegalH5>
      <LegalP>
        You represent and warrant that (i) You are not located in a country that
        is subject to the United States government embargo, or that has been
        designated by the United States government as a "terrorist supporting"
        country, and (ii) You are not listed on any United States government list
        of prohibited or restricted parties.
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>Severability and Waiver</LegalH5>
      <LegalH6>Severability</LegalH6>
      <LegalP>
        If any provision of these Terms is held to be unenforceable or invalid,
        such provision will be changed and interpreted to accomplish the
        objectives of such provision to the greatest extent possible under
        applicable law and the remaining provisions will continue in full force
        and effect.
      </LegalP>
      <LegalH6>Waiver</LegalH6>
      <LegalP>
        Except as provided herein, the failure to exercise a right or to require
        performance of an obligation under these Terms shall not affect a party's
        ability to exercise such right or require such performance at any time
        thereafter nor shall the waiver of a breach constitute a waiver of any
        subsequent breach.
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>Translation Interpretation</LegalH5>
      <LegalP>
        These Terms and Conditions may have been translated if We have made them
        available to You on our Service. You agree that the original English
        text shall prevail in the case of a dispute.
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>Changes to These Terms and Conditions</LegalH5>
      <LegalP>
        We reserve the right, at Our sole discretion, to modify or replace these
        Terms at any time. If a revision is material We will make reasonable
        efforts to provide at least 30 days' notice prior to any new terms
        taking effect. What constitutes a material change will be determined at
        Our sole discretion.
      </LegalP>
      <LegalP>
        By continuing to access or use Our Service after those revisions become
        effective, You agree to be bound by the revised terms. If You do not
        agree to the new terms, in whole or in part, please stop using the
        website and the Service.
      </LegalP>
    </LegalSection>

    <LegalSection>
      <LegalH5>Contact Us</LegalH5>
      <LegalP>
        If you have any questions about these Terms and Conditions, You can
        contact us by visiting this page on our website: {legalContactPath}
      </LegalP>
      <LegalP>
        You can also reach us in the app via the{" "}
        <LegalLink screen={mobileRoutes.public.contact}>Contact Us</LegalLink>{" "}
        page.
      </LegalP>
    </LegalSection>
  </>
);
