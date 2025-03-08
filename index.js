#!/usr/bin/env node

const { program } = require("commander");
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const componentsJsonFilePath = path.join(process.cwd(), 'components.json');
const tailwindConfigFilePath = path.join(process.cwd(), 'tailwind.config.ts');
const cssDestinationPath = path.join(process.cwd(), "src/screen.css")
const cssSourcePath = path.join(__dirname, "css/screen.css")

const packageComponentsPath = path.join(__dirname, 'components');

const getComponents = (destinationDir, componentName) => {
    const sourcePath = path.join(packageComponentsPath, `${componentName}.tsx`);

    const destinationFile = path.join(destinationDir, `${componentName}.tsx`);

    fs.readFile(sourcePath, 'utf-8', (readErr, data) => {
        if (readErr) {
            console.error("Error getting component", componentName, "from", sourcePath, readErr);
            process.exit(1);
        }

        fs.mkdir(destinationDir, { recursive: true }, (mkdirErr) => {
            if (mkdirErr) {
                console.error("Error creating directory", destinationDir, mkdirErr);
                process.exit(1);
            }

            fs.writeFile(destinationFile, data, (writeErr) => {
                if (writeErr) {
                    console.error("Error writing component to", destinationFile, writeErr);
                    process.exit(1);
                }
                console.log(`Component ${componentName} successfully written to ${destinationFile}`);
            });
        });
    });
};

const checkRequirements = async () => {
    let response = { isSuccess: false, componentRoute: "" }
    console.log("checking existing config: components.json", fs.existsSync(componentsJsonFilePath), "tailwind config", fs.existsSync(tailwindConfigFilePath))
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
        return response
    };
};

const getCss = async () => {
    const { isSuccess } = await checkRequirements()

    if (!isSuccess) {
        console.log("Requirements not met")
        process.exit(1)
    }

    const cssData = await fsPromises.readFile(cssSourcePath, 'utf-8')

    if (!cssData) {
        console.log("CSS source file not found!")
        process.exit(1)
    }

    fs.writeFile(cssDestinationPath, cssData, (writeErr) => {
        if (writeErr) {
            console.error("Error writing component to", cssDestinationPath, writeErr);
            process.exit(1);
        }
        console.log(`CSS successfully written to ./src`);
    });

}

program
    .command('add')
    .argument('<string>')
    .action(async (str) => {
        console.log(`adding ${str}...`);
        const { isSuccess, componentRoute } = await checkRequirements();

        if (!isSuccess) {
            console.log("Requirements not met...")
            process.exit(1);
        }

        getComponents(componentRoute, str);
    });

program.command("styles")
    .action(() => {
        getCss()
    })

program.parse();
