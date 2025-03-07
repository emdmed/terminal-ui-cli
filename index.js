const { program } = require("commander");
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const componentsJsonFilePath = path.join(process.cwd(), 'components.json');
const tailwindConfigFilePath = path.join(process.cwd(), 'tailwind.config.ts');

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
    if (fs.existsSync(componentsJsonFilePath) && fs.existsSync(tailwindConfigFilePath)) {
        try {
            const data = await fsPromises.readFile(componentsJsonFilePath, 'utf-8');
            const components = JSON.parse(data);
            const componentRoute = path.join(process.cwd(), `src${components.aliases.components.replace("@", "")}/ui`);
            return { isSuccess: true, componentRoute };
        } catch (err) {
            console.error('Error reading components file:', err);
            return { isSuccess: false, componentRoute: "" };
        }
    } else {
        console.log("Requirements not met");
        return { isSuccess: false, componentRoute: "" };
    }
};

program
    .command('add')
    .argument('<string>')
    .action(async (str, options) => {
        console.log("options", options)
        console.log(`adding ${str}...`);
        const { isSuccess, componentRoute } = await checkRequirements();

        if (!isSuccess) {
            console.log("Requirements not met...")
            process.exit(1);
        }

        getComponents(componentRoute, str);
    });

program.parse();
