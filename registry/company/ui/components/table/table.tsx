import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = React.forwardRef<HTMLTableElement, React.ComponentPropsWithoutRef<"table">>(
  ({ className, ...props }, ref) => <table ref={ref} className={cn("ds-table", className)} {...props} />
);

Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<"thead">>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("ds-table-header", className)} {...props} />
);

TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<"tbody">>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn("ds-table-body", className)} {...props} />
);

TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<"tfoot">>(
  ({ className, ...props }, ref) => <tfoot ref={ref} className={cn("ds-table-footer", className)} {...props} />
);

TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.ComponentPropsWithoutRef<"tr">>(
  ({ className, ...props }, ref) => <tr ref={ref} className={cn("ds-table-row", className)} {...props} />
);

TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<"th">>(
  ({ className, scope = "col", ...props }, ref) => (
    <th ref={ref} className={cn("ds-table-head", className)} scope={scope} {...props} />
  )
);

TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<"td">>(
  ({ className, ...props }, ref) => <td ref={ref} className={cn("ds-table-cell", className)} {...props} />
);

TableCell.displayName = "TableCell";

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.ComponentPropsWithoutRef<"caption">>(
  ({ className, ...props }, ref) => <caption ref={ref} className={cn("ds-table-caption", className)} {...props} />
);

TableCaption.displayName = "TableCaption";
