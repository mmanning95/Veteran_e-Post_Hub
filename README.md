# Veteran e-Post Hub

## Project summary

Introducing the Veteran E-Post Hub, a dynamic full-stack application designed to empower our community! Admin users can seamlessly moderate events—approving, rejecting, or deleting submissions—while also creating their own. Member users can submit events for approval, manage their own posts, and engage with comments. Plus, everyone—logged in or not—can explore a curated list of events, filter to find what matters most, and easily reach out to admins with any questions. Join us in fostering a vibrant community where every voice is heard!

### Additional information about the project

The Veteran E-Post Hub is a full-stack app designed to keep the Veterans of Whitman County informed about local events and opportunities. This platform empowers the veteran community by enabling easy event submissions and personalized filtering based on individual interests, ensuring that users can quickly find relevant information. With seamless social media integration and a user-friendly, accessible interface, the E-Post Hub aims to foster engagement and connection among veterans. Our dedicated team is excited about this initiative and is committed to serving the local veteran community with pride and passion

## Installation 
N/A
    
### Prerequisites

The only thing needed to use Veteran e-Post Hub is an internet-connected device, such as a PC, laptop, tablet, or smartphone.

### Add-ons

- [Next UI](nextui.org) - Used for the front end design (Deprecated and now is called HeroUI)
- [Next JS](nextjs.org) - The framework used for our e-Post Hub
- [Tailwind CSS](tailwindcss.com) - A script command for css. Helps by scripting front end design commands
- [Zod](zod.dev) -  Used for validations
- [React Icons](https://react-icons.github.io/react-icons/) - A library of icons used with the webapp 
- [React Hook Forms](https://react-hook-form.com/) - Used for managing and validating forms
- [Prisma](https://www.prisma.io/) - Helps with collabrative database enviroments
- [SQLlite](https://www.sqlite.org/) - database used to save accounts and other important information
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - hash used for password hashing
- [Vercel](https://vercel.com/docs) - Used for our website deployment
- [Vitest](https://vitest.dev/) - Used for testing our website

### Installation Steps - (Dev steps)

1. Clone the Repository:
    - git clone https://github.com/mmanning95/veteran-e-post-hub.git
    - cd veteran-e-post-hub
2. Install Dependencies:
    - npm install
3. Setup the database:
    - Create your own database
    - Recommended: SQlite for local testing
4. Start Server:
    - npx run dev

### Functionality

#### Admin Experience
- **Full Control & Moderation:**  
  Administrators are granted comprehensive control over the website. They have the authority to delete any content as needed, ensuring the platform remains current and free from inappropriate or outdated information.
- **Content Approval:**  
  Admins have access to a dedicated notification page, where they can review and approve events, posts, and community questions before they are made publicly available. This moderation process helps maintain high content quality and relevance.
- **Enhanced Management Tools:**  
  With advanced management features, administrators can efficiently oversee both user-generated content and system settings, ensuring a secure and well-maintained platform.

#### Member Experience
- **Interactive Participation:**  
  Authenticated members enjoy an enhanced experience compared to guests. In addition to viewing content, members can actively engage by commenting on posts and responding to community questions.
- **Community Engagement:**  
  This interactive functionality fosters communication and collaboration among users, encouraging the exchange of ideas while maintaining a secure environment.
- **Consistent Public Access:**  
  Aside from the additional interactive features, members have the same access to public content as guests, ensuring a seamless and unified user experience across the platform.

#### Guest Experience
- **Read-Only Access:**  
  Guests, or users who are not logged in, receive a read-only experience. They can browse public content, including event listings and community posts, but cannot interact with or modify any data.
- **Data Protection:**  
  To maintain privacy and security, all sensitive information is completely hidden from guest users, ensuring that critical data and administrative controls are accessible only to authenticated users.

---

By implementing role-specific pages and functionalities, the application not only enhances user engagement but also ensures robust security and content management. Each user's experience is carefully tailored to their permissions and needs, resulting in a more organized, interactive, and secure website overall.

## Known Problems

N/A


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Additional Documentation

  * [Sprint reports](https://github.com/mmanning95/ACME26WCV-Cpts421/blob/main/Documentation/Sprint%20Reports/)
  * [Meeting Minutes](https://github.com/mmanning95/ACME26WCV-Cpts421/blob/main/Meeting%20Minutes/MoM.md)
  * [Training Document](https://github.com/mmanning95/ACME26WCV-Cpts421/blob/main/Training/training.md)
  * [Project Description](https://github.com/mmanning95/ACME26WCV-Cpts421/blob/main/Documentation/Sprint%201%20Documentation/Project_Description.docx)
  * [Presentations](https://github.com/mmanning95/ACME26WCV-Cpts421/tree/main/Presentations)

