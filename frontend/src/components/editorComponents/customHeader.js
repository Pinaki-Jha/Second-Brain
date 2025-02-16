class CustomHeader {
    static get toolbox() {
        return {
            title: "Heading",
            icon: "H",
        };
    }
    static get conversionConfig() {
        return {
            export: (data) => {
                return data.text; // ✅ Converts to plain text when switched to another block
            },
            import: (text) => {
                return { text: text, level: 1 }; // ✅ Converts plain text back to a heading
            },
        };
    }
    

    constructor({ data, config, api }) {
        this.api = api;
        this.config = config || { placeholder: "Enter a heading", levels: [1, 2, 3, 4, 5, 6], defaultLevel: 1 };
        this.data = data || { text: "", level: this.config.defaultLevel };

        this.wrapper = document.createElement("p");
        this.wrapper.contentEditable = true;
        this.wrapper.innerHTML = this.data.text || this.config.placeholder;

        this.applyLevel(this.data.level);
    }

    applyLevel(level) {
        this.wrapper.className = ""; // ✅ Clear previous classes
        this.wrapper.classList.add(`custom-heading-${level || this.config.defaultLevel}`);
    
        // ✅ Ensure the parent block doesn't get stretched
        setTimeout(() => {
            const parentBlock = this.wrapper.closest(".ce-block");
            if (parentBlock && parentBlock.classList.contains("ce-block--stretched")) {
                parentBlock.classList.remove("ce-block--stretched");
            }
        }, 0);
    
        this.data.level = level;
    }

    render() {
        return this.wrapper;
    }

    save() {
        return {
            text: this.wrapper.innerHTML,
            level: this.data.level || this.config.defaultLevel,
        };
    }

    // ✅ Add settings menu for level selection
    renderSettings() {
        const wrapper = document.createElement("div");

        this.config.levels.forEach((level) => {
            const button = document.createElement("button");
            button.innerText = `H${level}`;
            button.classList.add("custom-header-button");

            button.onclick = () => {
                this.applyLevel(level);
                this.api.blocks.stretchBlock(this.api.blocks.getCurrentBlockIndex()); // ✅ Ensure UI updates
            };

            wrapper.appendChild(button);
        });

        return wrapper;
    }

    static get defaultConfig() {
        return {
            placeholder: "Enter a heading",
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 1,
        };
    }
}
export default CustomHeader;
