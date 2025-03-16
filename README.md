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

### Installation Steps - (Dev steps)

1. Clone the Repository:
    - git clone https://github.com/mmanning95/veteran-e-post-hub.git
    - cd veteran-e-post-hub
2. Install Dependencies:
    - Bundle install
3. Setup database:
    - npx prisma generate
    - npx prisma db push
4. Start Server:
    - npx run dev

### Functionality

At this stage of the project, we have completed key development tasks, including laying the foundation for the website, creating a homepage, an admin page, an event editing page for administrators.

When on the  homepage, to access the admin page, click the button located in the top-left corner of the screen which will direct you to the dedicated admin interface. On this page you will find two buttons: one to return to the homepage and another to access the event editing page. By selecting the "Edit Events" button you will be taken to the admin event editing page where you can modify fields such as Event Title, Event Description, and more. The page also includes two buttons in the top-left corner, one to return to the homepage and the other to navigate back to the admin interface.

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
  * [System Requirements and Specifications](https://github.com/mmanning95/ACME26WCV-Cpts421/blob/main/Documentation/Sprint%201%20Documentation/Requirements_and_Specifications_Template.docx)
  * [Presentations](https://github.com/mmanning95/ACME26WCV-Cpts421/tree/main/Presentations)

