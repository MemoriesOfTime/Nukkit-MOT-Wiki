import React, { useState } from 'react';
import styles from './styles.module.css';

interface Node {
    name: string;
    children: { [key: string]: Node };
}

interface Props {
    nodes: Node;
    depth: number;
    name: string;
}

const FolderViewChild: React.FC<Props> = ({ nodes, depth, name }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleChildren = () => {
        if (isFolder()) {
            setCollapsed(!collapsed);
        }
    };

    const getDisplay = () => {
        if (depth === -1) {
            return '';
        }
        return getIcon(name) + getName(name);
    };

    const isFolder = () => {
        return Object.keys(nodes.children).length > 0;
    };

    const getNodes = () => {
        return Object.values(nodes.children);
    };

    const getIcon = (path: string) => {
        if (isFolder()) {
            return '📁';
        }
        const type = path.split('.').pop();
        if (type === 'js' || type === 'ts' || type === 'yml' || type === 'json' || type === 'mcfunction') {
            return '📄';
        } else if (type === 'mcstructure') {
            return '🏛';
        } else if (type === 'png' || type === 'jpg' || type === 'jpeg') {
            return '🖼️';
        } else if (type === 'ogg' || type === 'wav' || type === 'mp3' || type === 'fsb') {
            return '🔊';
        } else if (type === 'lang') {
            return '🌍';
        } else {
            return '📁';
        }
    };

    const getName = (path: string) => {
        return path.split('/')[0];
    };

    const indent = {
        transform: `translate(${depth * 30}px)`,
    };

    return (
        <div>
            <div className="flex">
                <div
                    style={indent}
                    className={collapsed ? styles.collapsed : ''}
                    onClick={toggleChildren}
                >
                    {getDisplay()}
                </div>
            </div>

            <div className={collapsed ? styles.hidden : ''}>
                {getNodes().map((node, i) => (
                    <FolderViewChild
                        key={i}
                        depth={depth + 1}
                        nodes={node}
                        name={node.name}
                    />
                ))}
            </div>
        </div>
    );
};

export default FolderViewChild;
