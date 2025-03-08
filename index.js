#!/usr/bin/env node

const { program } = require("commander");
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

const dependencies = {
    accordion: "@radix-ui/react-accordion lucide-react",
    "alert-dialog": "@radix-ui/react-alert-dialog",
    alert: "class-variance-authority && npx terminal-ui add button",
    badge: "class-variance-authority",
    button: "@radix-ui/react-slot class-variance-authority",
    checkbox: "@radix-ui/react-checkbox lucide-react",
    command: "@radix-ui/react-dialog cmdk lucide-react",
    drawer: "vaul",
    label: "@radix-ui/react-label class-variance-authority",
    popover: "@radix-ui/react-popover",
    select: "@radix-ui/react-select lucide-react"
};

const componentsJsonFilePath = path.join(process.cwd(), 'components.json');
const tailwindConfigFilePath = path.join(process.cwd(), 'tailwind.config.ts');
const cssDestinationPath = path.join(process.cwd(), "src/screen.css");
const cssSourcePath = path.join(__dirname, "css/screen.css");

const packageComponentsPath = path.join(__dirname, 'components');

const copyComponent = (destinationDir, componentName) => {
    return new Promise((resolve, reject) => {
        const sourcePath = path.join(packageComponentsPath, `${componentName}.tsx`);
        const destinationFile = path.join(destinationDir, `${componentName}.tsx`);

        fs.readFile(sourcePath, 'utf-8', (readErr, data) => {
            if (readErr) {
                return reject(`Error getting component ${componentName} from ${sourcePath}: ${readErr}`);
            }

            fs.mkdir(destinationDir, { recursive: true }, (mkdirErr) => {
                if (mkdirErr) {
                    return reject(`Error creating directory ${destinationDir}: ${mkdirErr}`);
                }

                fs.writeFile(destinationFile, data, (writeErr) => {
                    if (writeErr) {
                        return reject(`Error writing component to ${destinationFile}: ${writeErr}`);
                    }
                    console.log(`Component ${componentName} successfully written to ${destinationFile}`);
                    resolve();
                });
            });
        });
    });
};

const checkRequirements = async () => {
    let response = { isSuccess: false, componentRoute: "" };
    console.log("checking existing config: components.json", fs.existsSync(componentsJsonFilePath), "tailwind config", fs.existsSync(tailwindConfigFilePath));
    if (fs.existsSync(componentsJsonFilePath) && fs.existsSync(tailwindConfigFilePath)) {
        try {
            const data = await fsPromises.readFile(componentsJsonFilePath, 'utf-8');
            const components = JSON.parse(data);
            const componentRoute = path.join(process.cwd(), `src${components.aliases.components.replace("@", "")}/ui`);
            return { ...response, isSuccess: true, componentRoute };
        } catch (err) {
            console.error('Error reading components file:', err);
            return response;
        }
    } else {
        console.log("Requirements not met");
        return response;
    }
};

const getCss = async () => {
    const { isSuccess } = await checkRequirements();

    if (!isSuccess) {
        console.log("Requirements not met");
        process.exit(1);
    }

    try {
        const cssData = await fsPromises.readFile(cssSourcePath, 'utf-8');
        await fsPromises.writeFile(cssDestinationPath, cssData);
        console.log(`CSS successfully written to ./src`);
    } catch (writeErr) {
        console.error("Error handling CSS file:", writeErr);
        process.exit(1);
    }
};

program
    .command('add')
    .argument('<string>')
    .action(async (str) => {
        console.log(`adding ${str}...`);
        const { isSuccess, componentRoute } = await checkRequirements();

        if (!isSuccess) {
            console.log("Requirements not met...");
            process.exit(1);
        }

        try {
            await copyComponent(componentRoute, str);
            console.log(`Installing dependencies for ${str}...`);
            const installCmd = `npm i ${dependencies[str]}`;
            console.log("installCmd", installCmd)
            const { stdout, stderr } = await execPromise(installCmd, { cwd: process.cwd() });
            console.log(`Installed ${str} dependencies successfully!`);
            console.log(stdout);
            if (stderr) {
                console.error(stderr);
            }

   

            process.exit(0);
        } catch (error) {
            console.error("Error during add command:", error);
            process.exit(1);
        }
    });

program
    .command("styles")
    .action(() => {
        getCss();
    });

program.parse();
