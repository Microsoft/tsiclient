import * as d3 from 'd3';
import './EllipsisMenu.scss';
import {Utils} from "./../../Utils";
import {Component} from "./../../Interfaces/Component";

class EllipsisMenu extends Component {

    private containerElement: any;
    private buttonElement: any;
    private menuElement: any;
    private menuItems: Array<any>;
    private menuIsVisible: boolean;

	constructor(renderTarget: Element) {
        super(renderTarget);
    }

    private createIconPath (iconName: string, theme: string): string {
        var supportedNames: Array<string> = ["flag", "grid", "download"];
        return (supportedNames.indexOf(iconName) != -1) ? iconName + "Icon" : "";
    }

    public setMenuVisibility(isVisible) {
        this.menuIsVisible = isVisible;
        this.containerElement.classed("tsi-ellipsisMenuShown", this.menuIsVisible);
    }

    public render (menuItems, options: any = {}) {
        this.menuIsVisible = false;
        this.chartOptions.setOptions(options);

        this.containerElement = d3.select(this.renderTarget).classed("tsi-ellipsisMenuContainer", true);
        this.setMenuItems(menuItems);
        d3.select(this.renderTarget).selectAll("*").remove();
        super.themify(this.containerElement, this.chartOptions.theme);

        let self = this;
        this.buttonElement = d3.select(this.renderTarget).insert("button")
            .attr("class", "tsi-ellipsisButton")
            .attr("aria-label", "Show ellipsis menu")
            .on("click", function () {
                d3.select(this).attr("aria-label", self.menuIsVisible ? "Show ellipsis menu" : "Hide ellipsis menu");
                self.setMenuVisibility(!self.menuIsVisible)
            })
        
        this.menuElement = d3.select(this.renderTarget).insert("div")
            .attr("class", "tsi-ellipsisMenu");

        this.menuElement.selectAll(".tsi-ellipsisMenuItem").data(this.menuItems)
            .enter()
            .append("button")
            .classed("tsi-ellipsisMenuItem", true)
            .attr("aria-label", d => d.label)
            .on("click", (d: any) => {
                d.action();
            })
            .each(function () {
                d3.select(this)
                    .append("div")
                    .attr("class", (d: any) => "tsi-ellipsisMenuIcon " + self.createIconPath(d.iconClass, self.chartOptions.theme));

                d3.select(this)
                    .append("div")
                    .classed("tsi-ellipsisMenuLabel", true)
                    .html((d: any) => d.label);
                    
                d3.select(this)
                    .append("div")
                    .classed("tsi-ellipsisMenuDescription", true)
                    .style("display", "none");
            });
    }

    private setMenuItems (rawMenuItems: Array<any>) {
        // TODO - add validaction to each rawMenuItem
        this.menuItems = rawMenuItems.reduce((menuItems, currMenuItem) => {
            menuItems.push({
                iconClass : currMenuItem.iconClass,
                label: currMenuItem.label,
                action: currMenuItem.action,
                description: currMenuItem.description
            });
            return menuItems;
        }, []);
    }
}

export {EllipsisMenu}