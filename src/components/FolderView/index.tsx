import React from 'react';
import FolderViewChild from './FolderViewChild';
import styles from './styles.module.css';

interface FolderNode {
    name: string;
    children: { [key: string]: FolderNode };
}

interface Props {
    paths: string[];
}

const FolderView: React.FC<Props> = ({ paths }) => {
    const fillDict = (data: { [key: string]: any }, path: string[]) => {
        let first = path.shift();

        // Create if needed
        if (!(first in data)) {
            data[first] = {
                name: first,
                children: {},
            };
        }

        // If there are more paths, recurse
        if (path.length > 0) {
            fillDict(data[first]['children'], path);
        }
    };

    const getData = () => {
        let data: FolderNode = {
            name: 'root',
            children: {},
        };

        paths.forEach(path => {
            const pathArray = path.split('/');
            fillDict(data['children'], pathArray);
        });

        return data;
    };

    return (
        <div className={styles.folderView}>
            <FolderViewChild depth={-1} name="." nodes={getData()} />
        </div>
    );
};

export default FolderView;
