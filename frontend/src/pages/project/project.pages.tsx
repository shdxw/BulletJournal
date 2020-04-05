import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Project } from '../../features/project/interface';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { GroupsWithOwner } from '../../features/group/interface';
import { Avatar, Divider, Popconfirm, Popover, Tooltip } from 'antd';
import { deleteProject, getProject } from '../../features/project/actions';
import { iconMapper } from '../../components/side-menu/side-menu.component';
import { DeleteOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';
import EditProject from '../../components/modals/edit-project.component';
import AddNote from '../../components/modals/add-note.component';
import AddTask from '../../components/modals/add-task.component';
import AddTransaction from '../../components/modals/add-transaction.component';
import { ProjectType } from '../../features/project/constants';
import { NoteTree } from '../../components/note-tree';
import { History } from 'history';
import { getGroupByProject } from '../projects/projects.pages';
import TaskTree from './task-tree.component';
import TransactionProject from './transaction-project.pages';

import './project.styles.less';

type ProjectPathParams = {
  projectId: string;
};

type ModalState = {
  isShow: boolean;
  groupName: string;
};

type GroupProps = {
  groups: GroupsWithOwner[];
};

interface ProjectPathProps extends RouteComponentProps<ProjectPathParams> {
  projectId: string;
}

type ProjectPageProps = {
  history: History<History.PoorMansUnknown>;
  project: Project;
  getProject: (projectId: number) => void;
  deleteProject: (
    projectId: number,
    name: string,
    history: History<History.PoorMansUnknown>
  ) => void;
};

type MyselfProps = {
  myself: string;
};

class ProjectPage extends React.Component<
  ProjectPageProps & ProjectPathProps & GroupProps & MyselfProps,
  ModalState
> {
  state: ModalState = {
    isShow: false,
    groupName: ''
  };

  componentDidMount() {
    const projectId = this.props.match.params.projectId;
    this.props.getProject(parseInt(projectId));
  }

  componentDidUpdate(prevProps: ProjectPathProps): void {
    const projectId = this.props.match.params.projectId;
    if (projectId !== prevProps.match.params.projectId) {
      this.props.getProject(parseInt(projectId));
    }
  }

  onClickGroup = (groupId: number) => {
    this.props.history.push(`/groups/group${groupId}`);
  };

  saveProject = () => {
    this.setState({ isShow: false });
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };

  render() {
    const { project, myself, history } = this.props;

    let createContent = null;
    let projectContent = null;
    let showCompletedTasks = null;
    switch (project.projectType) {
      case ProjectType.NOTE:
        createContent = <AddNote />;
        projectContent = <NoteTree />;
        break;
      case ProjectType.TODO:
        createContent = <AddTask />;
        projectContent = <TaskTree />;
        showCompletedTasks = <Tooltip placement='top' title='Show Completed Tasks'>
          <CheckCircleOutlined style={{ paddingLeft: '0.5em' }} />
        </Tooltip>;
        break;
      case ProjectType.LEDGER:
        createContent = <AddTransaction />;
        projectContent = <TransactionProject />;
    }

    let editContent = null;
    let deleteContent = null;
    if (myself === project.owner) {
      editContent = <EditProject project={project} />;
      deleteContent = (
        <Popconfirm
          title='Deleting BuJo also deletes its child BuJo. Are you sure?'
          okText='Yes'
          cancelText='No'
          onConfirm={() => {
            this.props.deleteProject(project.id, project.name, history);
          }}
          className='group-setting'
          placement='bottom'
        >
          <Tooltip placement='top' title='Delete BuJo'>
            <DeleteOutlined style={{ paddingLeft: '0.5em' }} />
          </Tooltip>
        </Popconfirm>
      );
    }

    let description = null;
    if (project.description) {
      description = (
        <div className='project-description'>
          {project.description.split('\n').map((s, key) => {
            return <p>{s}</p>;
          })}
          <Divider style={{ marginTop: '8px' }} />
        </div>
      );
    }

    const group = getGroupByProject(this.props.groups, project);
    let popContent = null;
    if (group) {
      popContent = (
        <div>
          {group.users.map((u, index) => (
            <p key={index}>
              <Avatar size='small' src={u.avatar} />
              &nbsp;{u.name}
            </p>
          ))}
        </div>
      );
    }

    return (
      <div className='project'>
        <Tooltip
          placement='top'
          title={project.owner}
          className='project-avatar'
        >
          <span>
            <Avatar size='large' src={project.ownerAvatar} />
          </span>
        </Tooltip>
        <div className='project-header'>
          <h2>
            <Tooltip
              placement='top'
              title={`${project.projectType} ${project.name}`}
            >
              <span>
                {iconMapper[project.projectType]}
                &nbsp;{project.name}
              </span>
            </Tooltip>
          </h2>
          <div className='project-control'>
            <Popover
              title={group && group.name}
              placement='bottom'
              content={popContent}
            >
              <span
                style={{ cursor: 'pointer' }}
                onClick={e => this.onClickGroup(group.id)}
              >
                <TeamOutlined />
                {group && group.users.length}
              </span>
            </Popover>
            {showCompletedTasks}
            {createContent}
            {editContent}
            {deleteContent}
          </div>
        </div>
        {description && (
          <div className='project-description'>{description}</div>
        )}
        <div className='project-content'>{projectContent}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  groups: state.group.groups,
  myself: state.myself.username
});

export default connect(mapStateToProps, { getProject, deleteProject })(
  ProjectPage
);
